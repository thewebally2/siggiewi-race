import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function EditionsManagement() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEdition, setEditingEdition] = useState<any | null>(null);

  const utils = trpc.useUtils();
  const { data: editions, isLoading } = trpc.admin.editions.getAll.useQuery();

  const deleteEdition = trpc.admin.editions.delete.useMutation({
    onSuccess: () => {
      toast.success("Edition deleted successfully");
      utils.admin.editions.getAll.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to delete edition: " + error.message);
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this edition? This will also delete all associated data.")) {
      deleteEdition.mutate({ id });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Race Editions</h1>
            <p className="text-gray-600 mt-2">Manage race editions and their details</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Edition
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Race Edition</DialogTitle>
                <DialogDescription>
                  Add a new race edition with all the details
                </DialogDescription>
              </DialogHeader>
              <EditionForm 
                onSuccess={() => {
                  setIsCreateOpen(false);
                  utils.admin.editions.getAll.invalidate();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : editions && editions.length > 0 ? (
          <div className="grid gap-6">
            {editions.map((edition) => (
              <Card key={edition.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{edition.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(edition.date).toLocaleDateString('en-GB', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Race Edition</DialogTitle>
                          </DialogHeader>
                          <EditionForm 
                            edition={edition}
                            onSuccess={() => {
                              utils.admin.editions.getAll.invalidate();
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(edition.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Year</div>
                      <div className="font-medium">{edition.year}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Status</div>
                      <div className={`font-medium capitalize inline-block px-2 py-1 rounded text-sm ${
                        edition.status === 'published' ? 'bg-green-100 text-green-700' :
                        edition.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        edition.status === 'archived' ? 'bg-gray-100 text-gray-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {edition.status}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Registration</div>
                      <div className="font-medium">
                        {edition.registrationOpen ? "Open" : "Closed"}
                      </div>
                    </div>
                  </div>
                  {edition.description && (
                    <p className="mt-4 text-gray-700">{edition.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">No race editions found. Create your first edition to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

function EditionForm({ edition, onSuccess }: { edition?: any; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    year: edition?.year || new Date().getFullYear(),
    title: edition?.title || "",
    date: edition?.date ? new Date(edition.date).toISOString().split('T')[0] : "",
    description: edition?.description || "",
    location: edition?.location || "",
    status: edition?.status || "draft",
    heroImage: edition?.heroImage || "",
    charityName: edition?.charityName || "Dar tal-Providenza",
    charityDescription: edition?.charityDescription || "Homes of Persons with Disabilities",
    registrationOpen: edition?.registrationOpen ?? true,
  });

  const createEdition = trpc.admin.editions.create.useMutation({
    onSuccess: () => {
      toast.success("Edition created successfully");
      onSuccess();
    },
    onError: (error) => {
      toast.error("Failed to create edition: " + error.message);
    },
  });

  const updateEdition = trpc.admin.editions.update.useMutation({
    onSuccess: () => {
      toast.success("Edition updated successfully");
      onSuccess();
    },
    onError: (error) => {
      toast.error("Failed to update edition: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      year: Number(formData.year),
      date: new Date(formData.date),
      status: formData.status as any,
    };

    if (edition) {
      updateEdition.mutate({ id: edition.id, ...data });
    } else {
      createEdition.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year *</Label>
          <Input
            id="year"
            type="number"
            required
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Is-Siggiewi End of Year Race 2025"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Siggiewi, Malta"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="heroImage">Hero Image URL</Label>
          <Input
            id="heroImage"
            value={formData.heroImage}
            onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="charityName">Charity Name</Label>
          <Input
            id="charityName"
            value={formData.charityName}
            onChange={(e) => setFormData({ ...formData, charityName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="charityDescription">Charity Description</Label>
          <Input
            id="charityDescription"
            value={formData.charityDescription}
            onChange={(e) => setFormData({ ...formData, charityDescription: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.registrationOpen}
              onChange={(e) => setFormData({ ...formData, registrationOpen: e.target.checked })}
              className="rounded"
            />
            Registration Open
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button 
          type="submit" 
          className="bg-orange-500 hover:bg-orange-600"
          disabled={createEdition.isPending || updateEdition.isPending}
        >
          {edition ? "Update Edition" : "Create Edition"}
        </Button>
      </div>
    </form>
  );
}

