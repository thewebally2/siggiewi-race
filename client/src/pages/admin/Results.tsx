import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, Trash2, FileSpreadsheet } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminResults() {
  const [selectedEditionId, setSelectedEditionId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const { data: editions } = trpc.admin.editions.getAll.useQuery();
  const { data: categories } = trpc.races.getCategoriesByEdition.useQuery(
    { editionId: Number(selectedEditionId) },
    { enabled: !!selectedEditionId }
  );
  const { data: results, refetch: refetchResults } = trpc.races.getResultsByCategory.useQuery(
    { editionId: Number(selectedEditionId), categoryId: Number(selectedCategoryId) },
    { enabled: !!selectedEditionId && !!selectedCategoryId }
  );

  const uploadResults = trpc.admin.results.uploadResults.useMutation({
    onSuccess: () => {
      toast.success("Results uploaded successfully");
      refetchResults();
      setCsvFile(null);
      setPreviewData([]);
    },
    onError: (error: any) => {
      toast.error(`Failed to upload results: ${error.message}`);
    },
  });

  const deleteResult = trpc.admin.results.deleteResult.useMutation({
    onSuccess: () => {
      toast.success("Result deleted");
      refetchResults();
    },
    onError: (error: any) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    setCsvFile(file);

    // Parse CSV for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        return row;
      });

      setPreviewData(data.slice(0, 10)); // Show first 10 rows
    };
    reader.readAsText(file);
  };

  const handleUpload = () => {
    if (!csvFile || !selectedEditionId || !selectedCategoryId) {
      toast.error("Please select edition, category, and CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const results = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx];
        });

        return {
          editionId: Number(selectedEditionId),
          categoryId: Number(selectedCategoryId),
          participantName: row.name || row.participantname || '',
          bibNumber: row.bib || row.bibnumber ? Number(row.bib || row.bibnumber) : undefined,
          finishTime: row.time || row.finishtime || '',
          position: row.position ? Number(row.position) : index + 1,
          gender: (row.gender || '').toLowerCase() as 'male' | 'female' | 'other' | undefined,
          ageCategory: row.category || row.agecategory || undefined,
        };
      });

      uploadResults.mutate({ results });
    };
    reader.readAsText(csvFile);
  };

  const downloadTemplate = () => {
    const csv = `name,bib,time,position,gender,category
John Doe,101,00:19:45,1,male,Open
Jane Smith,102,00:20:12,2,female,Open`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'race_results_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Race Results Management</h1>
        <p className="text-gray-600 mt-2">Upload and manage race results from CSV files</p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Results</CardTitle>
          <CardDescription>
            Import race results from a CSV file. Download the template to see the required format.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Race Edition</Label>
              <Select value={selectedEditionId} onValueChange={setSelectedEditionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select edition" />
                </SelectTrigger>
                <SelectContent>
                  {editions?.map((edition: any) => (
                    <SelectItem key={edition.id} value={edition.id.toString()}>
                      {edition.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Race Category</Label>
              <Select 
                value={selectedCategoryId} 
                onValueChange={setSelectedCategoryId}
                disabled={!selectedEditionId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>CSV File</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="w-4 h-4 mr-2" />
                Template
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              CSV columns: name, bib, time, position, gender (male/female/other), category
            </p>
          </div>

          {previewData.length > 0 && (
            <div className="space-y-2">
              <Label>Preview (first 10 rows)</Label>
              <div className="border rounded-lg overflow-auto max-h-64">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(previewData[0]).map((key) => (
                        <TableHead key={key}>{key}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row, idx) => (
                      <TableRow key={idx}>
                        {Object.values(row).map((value: any, vidx) => (
                          <TableCell key={vidx}>{value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <Button 
            onClick={handleUpload} 
            disabled={!csvFile || !selectedEditionId || !selectedCategoryId || uploadResults.isPending}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploadResults.isPending ? "Uploading..." : "Upload Results"}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Results */}
      {selectedEditionId && selectedCategoryId && (
        <Card>
          <CardHeader>
            <CardTitle>Current Results</CardTitle>
            <CardDescription>
              {results?.length || 0} results for selected category
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results && results.length > 0 ? (
              <div className="border rounded-lg overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Pos</TableHead>
                      <TableHead className="w-20">Bib</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>{result.position}</TableCell>
                        <TableCell>{result.bibNumber}</TableCell>
                        <TableCell>{result.participantName}</TableCell>
                        <TableCell className="capitalize">{result.gender}</TableCell>
                        <TableCell>{result.ageCategory}</TableCell>
                        <TableCell className="font-mono">{result.finishTime}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteResult.mutate({ id: result.id })}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileSpreadsheet className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No results uploaded yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

