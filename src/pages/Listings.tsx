import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, Bed, Bath, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api, Property } from "@/lib/api";
import { toast } from "sonner";

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState([1000, 10000]);
  const [bedrooms, setBedrooms] = useState("any");
  const [bathrooms, setBathrooms] = useState("any");
  const [sortBy, setSortBy] = useState("price-low");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchProperties();
  }, [sortBy]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Use getAllProperties to get real rental data
      const response = await api.getAllProperties(50);
      console.log("API Response:", response);
      console.log("Properties received:", response.data?.length || 0);
      
      let filteredProperties = response.data || [];
      
      // Apply filters
      if (searchQuery) {
        filteredProperties = filteredProperties.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.city.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (propertyType !== "all") {
        filteredProperties = filteredProperties.filter(p => {
          switch (propertyType) {
            case "flat":
              return p.property_type === "apartment" || p.property_type === "studio";
            case "villa":
              return p.property_type === "villa" || p.property_type === "house" || p.property_type === "independent_house";
            case "co-living":
              return p.property_type === "co_living_space" || p.property_type === "shared_apartment" || p.property_type === "hostel" || p.property_type === "pg";
            case "commercial":
              return p.property_type === "commercial";
            default:
              return true;
          }
        });
      }
      
      if (bedrooms !== "any") {
        const bedCount = parseInt(bedrooms);
        filteredProperties = filteredProperties.filter(p => p.bedrooms >= bedCount);
      }
      
      if (bathrooms !== "any") {
        const bathCount = parseInt(bathrooms);
        filteredProperties = filteredProperties.filter(p => p.bathrooms >= bathCount);
      }
      
      // Filter by price range (monthly rent)
      filteredProperties = filteredProperties.filter(p => {
        // The API returns prices that seem to be monthly rent already, not annual
        const monthlyPrice = p.price; // Use price as-is since it appears to be monthly
        return monthlyPrice >= priceRange[0] && monthlyPrice <= priceRange[1];
      });
      
      console.log("Filtered properties:", filteredProperties.length);
      console.log("Sample property:", filteredProperties[0]);
      
      setProperties(filteredProperties);
      setTotalResults(filteredProperties.length);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    fetchProperties();
    setCurrentPage(1);
  };

  const getSortedProperties = () => {
    let sorted = [...properties];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "newest":
        return sorted;
      default:
        return sorted;
    }
  };

  const paginatedProperties = getSortedProperties().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(properties.length / itemsPerPage);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filter Sidebar */}
          <aside className="w-full lg:w-1/3 lg:max-w-xs">
            <div className="sticky top-28 rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-gray-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Find your perfect place
              </h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Filter properties to match your needs.
              </p>
              
              <div className="mt-6 flex flex-col gap-6">
                {/* Search */}
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search by city, neighborhood..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 bg-background-light dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                  />
                </div>

                {/* Property Type */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="property-type" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Property Type
                  </Label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="bg-background-light dark:bg-slate-900 border-slate-300 dark:border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-900">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="flat">Apartments & Studios</SelectItem>
                      <SelectItem value="villa">Houses & Villas</SelectItem>
                      <SelectItem value="co-living">Co-living & Hostels</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Monthly Rent Range (₹)
                  </Label>
                  <Slider
                    min={1000}
                    max={10000}
                    step={500}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>₹{priceRange[0].toLocaleString()}/month</span>
                    <span>₹{priceRange[1].toLocaleString()}/month</span>
                  </div>
                </div>

                {/* Bedrooms & Bathrooms */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="bedrooms" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Bedrooms
                    </Label>
                    <Select value={bedrooms} onValueChange={setBedrooms}>
                      <SelectTrigger className="bg-background-light dark:bg-slate-900 border-slate-300 dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900">
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="bathrooms" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Bathrooms
                    </Label>
                    <Select value={bathrooms} onValueChange={setBathrooms}>
                      <SelectTrigger className="bg-background-light dark:bg-slate-900 border-slate-300 dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900">
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Apply Button */}
                <Button
                  onClick={handleApplyFilters}
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105"
                  disabled={loading}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {totalResults} results found
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] bg-background-light dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900">
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Property Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {paginatedProperties.map((property) => (
                    <Link
                      key={property.id || property.property_id}
                      to={`/property/${property.id || property.property_id}`}
                      className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-gray-800"
                    >
                      <div className="relative">
                        <img
                          alt={property.name}
                          className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          src={property.image_urls?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"}
                        />
                        <div className="absolute bottom-2 right-2 rounded-lg bg-primary/90 px-2 py-1 text-sm font-bold text-white">
                          ₹{(property.price / 12 / 1000).toFixed(1)}K/month
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h4 className="truncate text-lg font-bold text-slate-900 dark:text-white">
                          {property.name}
                        </h4>
                        <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                          {property.area || property.geo_location_details?.locality || 'Location not specified'}, {property.city || property.geo_location_details?.city || 'City not specified'}
                        </p>
                        <div className="mt-3 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                          {property.bedrooms && (
                            <span className="flex items-center gap-1.5">
                              <Bed className="h-4 w-4" />
                              {property.bedrooms} Bed{property.bedrooms > 1 ? 's' : ''}
                            </span>
                          )}
                          {property.bathrooms && (
                            <span className="flex items-center gap-1.5">
                              <Bath className="h-4 w-4" />
                              {property.bathrooms} Bath{property.bathrooms > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                            {property.property_type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-primary font-medium">
                            {property.platform_name}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? "bg-primary text-white font-bold"
                              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    {totalPages > 5 && (
                      <>
                        <span className="text-slate-500 dark:text-slate-400">...</span>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                            currentPage === totalPages
                              ? "bg-primary text-white font-bold"
                              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                          }`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Listings;

