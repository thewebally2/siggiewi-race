import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_LOGO, APP_TITLE, CHARITY_INFO } from "@/const";
import { trpc } from "@/lib/trpc";
import { Calendar, MapPin, Users, Trophy, Download, Clock, Mountain, Route as RouteIcon, Heart } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: editions, isLoading } = trpc.races.getPublishedEditions.useQuery();
  const currentEdition = editions?.[0];

  const { data: categories } = trpc.races.getCategoriesByEdition.useQuery(
    { editionId: currentEdition?.id || 0 },
    { enabled: !!currentEdition }
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between h-20">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <img src={APP_LOGO} alt="Logo" className="h-14 w-auto" />
              </div>
            </Link>
            <nav className="flex items-center gap-6">
              <a href="#about" className="text-gray-700 hover:text-orange-600 font-medium">About</a>
              <a href="#races" className="text-gray-700 hover:text-orange-600 font-medium">Races</a>
              <a href="#routes" className="text-gray-700 hover:text-orange-600 font-medium">Routes</a>
              <Link href="/previous-editions" className="text-gray-700 hover:text-orange-600 font-medium">
                Previous Editions
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-orange-600 font-medium">
                Contact
              </Link>
              <Link href="/register">
                <Button className="bg-orange-500 hover:bg-orange-600">Register Now</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/hero-banner.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Colorful running track stripe */}
        <div className="absolute top-0 right-0 w-full h-full">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-80">
            <div className="race-gradient h-full transform skew-x-12 origin-top-right"></div>
          </div>
        </div>

        <div className="relative z-10 container text-center text-white">
          <h1 className="text-5xl md:text-7xl font-black mb-4 drop-shadow-lg">
            {currentEdition?.title || "IS-SIGGIEWI END OF YEAR RACE"}
          </h1>
          {currentEdition && (
            <div className="flex items-center justify-center gap-2 text-2xl md:text-3xl mb-8">
              <Calendar className="w-8 h-8" />
              <span className="font-bold">
                {new Date(currentEdition.date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          )}
          <Link href="/register">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-xl px-12 py-6 h-auto">
              REGISTER NOW
            </Button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">About the Race</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {currentEdition?.description || 
                "Join us for the annual Is-Siggiewi End of Year Race, a community event celebrating fitness, family, and charity. All proceeds support Dar tal-Providenza, providing care and support for persons with disabilities."}
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-bold text-xl mb-2">Community Event</h3>
                <p className="text-gray-600">For runners of all ages and abilities</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-xl mb-2">Scenic Routes</h3>
                <p className="text-gray-600">Through the beautiful village of Siggiewi</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Trophy className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-xl mb-2">For Charity</h3>
                <p className="text-gray-600">Supporting {CHARITY_INFO.name}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Race Categories */}
      <section id="races" className="py-20">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">Race Categories</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {categories?.map((category) => (
              <Card key={category.id} className="hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{category.name}</CardTitle>
                  <CardDescription className="text-lg font-semibold">
                    {category.distance}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{category.ageGroup}</p>
                  <div className="text-3xl font-bold mb-6">
                    {category.priceInCents === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      <span>€{(category.priceInCents / 100).toFixed(2)}</span>
                    )}
                  </div>
                  <Link href="/register">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      REGISTER
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Routes Section with Tabs */}
      <section id="routes" className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-4">Race Routes</h2>
          <p className="text-center text-gray-600 mb-12">
            Explore each route with detailed information and download GPX files
          </p>
          
          {categories && categories.length > 0 ? (
            <Tabs defaultValue={categories[0]?.id.toString()} className="max-w-7xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id.toString()} className="text-base">
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id.toString()}>
                  <RouteDetails category={category} />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center text-gray-500">Loading routes...</div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <img src={APP_LOGO} alt="Logo" className="h-12 w-auto mb-4" />
              <p className="text-gray-400">{APP_TITLE}</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#races" className="text-gray-400 hover:text-white">Races</a></li>
                <li><a href="#routes" className="text-gray-400 hover:text-white">Routes</a></li>
                <li><Link href="/previous-editions" className="text-gray-400 hover:text-white">Previous Editions</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <p className="text-gray-400">Kunsill Lokali Is-Siggiewi</p>
              <p className="text-gray-400">Città Ferdinand</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400">
              <p>&copy; {new Date().getFullYear()} {APP_TITLE}. All rights reserved.</p>
              <div className="flex items-center gap-2">
                <span>another website by</span>
                <a href="https://www.thewebally.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  <img src="https://www.thewebally.com/resource/TWA-web.png" alt="TheWebAlly Logo" width="40" height="20" className="inline-block" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function RouteDetails({ category }: { category: any }) {
  const { data: route } = trpc.races.getRouteByCategory.useQuery({ categoryId: category.id });

  const getDifficultyBadge = () => {
    if (category.name.includes('5KM')) return { text: 'Moderate', color: 'bg-yellow-100 text-yellow-700' };
    if (category.name.includes('1.5KM')) return { text: 'Easy', color: 'bg-green-100 text-green-700' };
    return { text: 'Very Easy', color: 'bg-blue-100 text-blue-700' };
  };

  const difficulty = getDifficultyBadge();

  const getTerrainDescription = () => {
    if (category.name.includes('5KM')) return 'Mixed - Urban streets and rural paths';
    if (category.name.includes('1.5KM')) return 'Urban streets through the village';
    return 'Flat urban streets';
  };

  const getElevationDescription = () => {
    if (category.name.includes('5KM')) return 'Moderate hills with scenic viewpoints';
    if (category.name.includes('1.5KM')) return 'Gentle slopes';
    return 'Mostly flat terrain';
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Map Side */}
          <div className="relative h-96 md:h-auto bg-gray-100">
            <img 
              src="/download(2).png" 
              alt={`${category.name} route map`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-sm italic text-gray-700 bg-white/90 px-3 py-2 rounded">
                {category.description || `A challenging course through the historic center and countryside of Is-Siggiewi`}
              </p>
            </div>
          </div>

          {/* Details Side */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.distance}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficulty.color}`}>
                {difficulty.text}
              </span>
            </div>

            <div className="space-y-6">
              {/* Start Time */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-lg">Start Time</div>
                  <div className="text-gray-600">{category.startTime || '09:00'}</div>
                </div>
              </div>

              {/* Age Range */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-lg">Age Range</div>
                  <div className="text-gray-600">{category.ageGroup}</div>
                </div>
              </div>

              {/* Terrain */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <Mountain className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="font-semibold text-lg">Terrain</div>
                  <div className="text-gray-600">{getTerrainDescription()}</div>
                </div>
              </div>

              {/* Elevation */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <RouteIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="font-semibold text-lg">Elevation</div>
                  <div className="text-gray-600">{getElevationDescription()}</div>
                </div>
              </div>

              {/* Route Highlights */}
              <div className="pt-4 border-t">
                <div className="font-semibold text-lg mb-3">Route Highlights</div>
                <ul className="space-y-2 text-gray-600">
                  {category.name.includes('5KM') && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>Pass through historic Siggiewi village center</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>Scenic countryside views</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>Well-marked course with water stations</span>
                      </li>
                    </>
                  )}
                  {category.name.includes('1.5KM') && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>Fun route through village streets</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>Safe and supervised for children</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>Finisher medals for all participants</span>
                      </li>
                    </>
                  )}
                  {category.name.includes('500M') && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>Perfect for families with young children</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>Completely flat and accessible</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>Free entry for all ages</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Download GPX */}
              {route?.gpxFileUrl && (
                <div className="pt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <a href={route.gpxFileUrl} download>
                      <Download className="w-4 h-4 mr-2" />
                      Download GPX File
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

