import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Calendar, MapPin, Users, Trophy, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { APP_LOGO, APP_TITLE } from "@/const";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PreviousEditions() {
  const { data: editions, isLoading } = trpc.races.getPublishedEditions.useQuery();
  const [selectedEditionId, setSelectedEditionId] = useState<number | null>(null);

  // Get the first completed edition by default
  const completedEditions = editions?.filter(e => e.status === 'completed') || [];
  const selectedEdition = selectedEditionId 
    ? completedEditions.find(e => e.id === selectedEditionId)
    : completedEditions[0];

  const { data: categories } = trpc.races.getCategoriesByEdition.useQuery(
    { editionId: selectedEdition?.id || 0 },
    { enabled: !!selectedEdition }
  );

  const { data: results } = trpc.races.getResultsByEdition.useQuery(
    { editionId: selectedEdition?.id || 0 },
    { enabled: !!selectedEdition }
  );

  const { data: gallery } = trpc.races.getGalleryImages.useQuery(
    { editionId: selectedEdition?.id || 0 },
    { enabled: !!selectedEdition }
  );

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (completedEditions.length === 0) {
    return (
     <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

        <main className="container py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Previous Editions</h1>
            <p className="text-gray-600">No previous editions available yet.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Previous Editions</h1>
          <p className="text-gray-600">Explore past races and celebrate our amazing participants</p>
        </div>

        {/* Edition Selector */}
        {completedEditions.length > 1 && (
          <div className="mb-8 flex gap-4 flex-wrap">
            {completedEditions.map((edition) => (
              <Button
                key={edition.id}
                variant={selectedEdition?.id === edition.id ? "default" : "outline"}
                onClick={() => setSelectedEditionId(edition.id)}
                className={selectedEdition?.id === edition.id ? "bg-orange-500 hover:bg-orange-600" : ""}
              >
                {edition.year}
              </Button>
            ))}
          </div>
        )}

        {selectedEdition && (
          <>
            {/* Edition Overview */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">{selectedEdition.title}</CardTitle>
                <CardDescription className="flex flex-wrap gap-4 mt-2">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedEdition.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedEdition.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {results?.length || 0} Participants
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{selectedEdition.description}</p>
              </CardContent>
            </Card>

            {/* Race Results */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-orange-500" />
                  Race Results
                </CardTitle>
                <CardDescription>Official results for all race categories</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={categories?.[0]?.id.toString() || "0"} className="w-full">
                  <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${categories?.length || 1}, 1fr)` }}>
                    {categories?.map((category) => (
                      <TabsTrigger key={category.id} value={category.id.toString()}>
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {categories?.map((category) => {
                    const categoryResults = results?.filter(r => r.categoryId === category.id) || [];
                    
                    return (
                      <TabsContent key={category.id} value={category.id.toString()} className="mt-6">
                        <div className="mb-4 flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-semibold">{category.name}</h3>
                            <p className="text-sm text-gray-600">{category.distance} • {categoryResults.length} finishers</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                          </Button>
                        </div>

                        {categoryResults.length > 0 ? (
                          <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-20">Position</TableHead>
                                  <TableHead className="w-20">Bib</TableHead>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Gender</TableHead>
                                  <TableHead>Category</TableHead>
                                  <TableHead className="text-right">Time</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {categoryResults.map((result) => (
                                  <TableRow key={result.id} className={result.position && result.position <= 3 ? "bg-orange-50" : ""}>
                                    <TableCell className="font-medium">
                                      {result.position && result.position <= 3 ? (
                                        <div className="flex items-center gap-2">
                                          <Trophy className={`w-4 h-4 ${
                                            result.position === 1 ? 'text-yellow-500' :
                                            result.position === 2 ? 'text-gray-400' :
                                            'text-orange-600'
                                          }`} />
                                          {result.position}
                                        </div>
                                      ) : (
                                        result.position
                                      )}
                                    </TableCell>
                                    <TableCell>{result.bibNumber}</TableCell>
                                    <TableCell className="font-medium">{result.participantName}</TableCell>
                                    <TableCell className="capitalize">{result.gender}</TableCell>
                                    <TableCell>{result.ageCategory}</TableCell>
                                    <TableCell className="text-right font-mono">{result.finishTime}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            No results available for this category
                          </div>
                        )}
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </CardContent>
            </Card>

            {/* Photo Gallery */}
            {gallery && gallery.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Photo Gallery</CardTitle>
                  <CardDescription>Memories from the race day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gallery.map((image) => (
                      <div key={image.id} className="relative aspect-video rounded-lg overflow-hidden">
                        <img 
                          src={image.imageUrl} 
                          alt={image.caption || "Race photo"} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                            {image.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

