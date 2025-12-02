import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, SlidersHorizontal, Loader2, Zap, Brain, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { api, Property, DocumentedSearchRequest } from "@/lib/api";
import { toast } from "sonner";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [aiSummary, setAiSummary] = useState("");
  const [searchType, setSearchType] = useState<"hybrid" | "semantic" | "keyword">("hybrid");
  const [apiInfo, setApiInfo] = useState<any>(null);

  // Filter states
  const [city, setCity] = useState(""); // Changed from "Pune" to empty - let search query determine city
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState<number | undefined>();
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [areaRange, setAreaRange] = useState([0, 5000]);

  useEffect(() => {
    const initialQuery = searchParams.get("q");
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, []);

  const handleSearch = async (searchQuery?: string) => {
    const searchText = searchQuery || query;
    if (!searchText.trim()) {
      // If no search query, show all properties
      const request: DocumentedSearchRequest = {
        query: "all properties",
        limit: 50,
        search_type: searchType
      };
      
      try {
        const response = await api.searchProperties(request);
        const allProperties = response.data?.results || [];
        setProperties(allProperties);
        setTotalResults(allProperties.length);
        setApiInfo(response.data);
        toast.info(`Showing all ${allProperties.length} available properties`);
        return;
      } catch (error) {
        toast.error("Failed to load properties");
        return;
      }
    }

    setLoading(true);
    try {
      const request: DocumentedSearchRequest = {
        query: searchText,
        limit: 50, // Request more results for better filtering
        search_type: searchType
      };

      const response = await api.searchProperties(request);
      console.log("Search API Response:", response);
      console.log("Properties received:", response.data?.results?.length || 0);
      console.log("Total results from backend:", response.data?.total);
      
      // Get unique properties (deduplicate by id)
      let uniqueProperties = response.data?.results 
        ? Array.from(new Map(response.data.results.map(p => [p.id || p.property_id, p])).values())
        : [];
      
      // Apply client-side filtering if API doesn't filter properly
      if (uniqueProperties.length > 0) {
        const searchTerms = searchText.toLowerCase().split(' ').filter(term => term.length > 0);
        
        // Filter properties based on search query
        uniqueProperties = uniqueProperties.filter(property => {
          const searchableText = [
            property.name,
            property.description,
            property.property_type,
            property.city,
            property.area,
            property.platform_name,
            ...property.amenities,
            ...property.target_audience,
            ...property.special_features
          ].join(' ').toLowerCase();
          
          // Handle common search patterns
          const normalizedSearch = searchText.toLowerCase();
          
          // Direct matches
          if (searchableText.includes(normalizedSearch)) {
            return true;
          }
          
          // Check if all search terms are found in the property
          const allTermsMatch = searchTerms.every(term => {
            // Handle common abbreviations and variations
            const variations = [
              term,
              term.replace('bhk', 'bedroom'),
              term.replace('bedroom', 'bhk'),
              term.replace('pg', 'paying guest'),
              term.replace('paying guest', 'pg'),
              term.replace('apt', 'apartment'),
              term.replace('apartment', 'apt'),
              term.replace('flat', 'apartment'),
              term.replace('apartment', 'flat')
            ];
            
            return variations.some(variation => searchableText.includes(variation));
          });
          
          return allTermsMatch;
        });
        
        console.log(`Filtered from ${response.data?.results?.length || 0} to ${uniqueProperties.length} properties`);
      }
      
      // Sort by elasticsearch_score (if available) to show best matches first
      const sortedProperties = uniqueProperties.sort((a, b) => {
        const scoreA = a.elasticsearch_score || 0;
        const scoreB = b.elasticsearch_score || 0;
        return scoreB - scoreA;
      });
      
      console.log("Final filtered properties:", sortedProperties.length);
      console.log("API Info:", response.data);
      
      setProperties(sortedProperties);
      setTotalResults(sortedProperties.length); // Use actual filtered count
      setApiInfo(response.data);
      
      if (sortedProperties.length > 0) {
        toast.success(`Found ${sortedProperties.length} matching properties using ${searchType} search`);
      } else {
        toast.info("No properties found. Try adjusting your search criteria or search type.");
      }
    } catch (error) {
      console.error("Search error:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to search properties: ${errorMsg}`);
      // Ensure properties is set to empty array on error
      setProperties([]);
      setTotalResults(0);
      setApiInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const testDirectApi = async () => {
    try {
      console.log('Testing direct API call...');
      
      // Use proxy in development, direct URL in production
      const apiUrl = import.meta.env.DEV 
        ? '/api/v1/search'  // Use proxy in development
        : 'https://data-417505.uc.r.appspot.com/api/v1/search';  // Direct URL in production
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          query: 'property in pune',
          limit: 3,
          search_type: 'hybrid'
        })
      });
      
      console.log('Direct API response status:', response.status);
      const data = await response.json();
      console.log('Direct API response data:', data);
      
      if (data.results && data.results.length > 0) {
        toast.success(`Direct API test successful! Found ${data.results.length} properties`);
        setProperties(data.results);
        setTotalResults(data.total);
        setApiInfo(data);
      } else {
        toast.info('Direct API test successful but no results found');
      }
    } catch (error) {
      console.error('Direct API test failed:', error);
      toast.error(`Direct API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Property Search
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Use natural language to find your perfect property
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="e.g., 'property in pune', '2BHK apartment Mumbai', 'PG accommodation', or leave empty to see all"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12 text-base bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
              <Button type="submit" size="lg" className="h-12 px-6 bg-primary text-white font-bold" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <SearchIcon className="h-5 w-5 mr-2" />
                    Search
                  </>
                )}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Search Type Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Label className="text-sm font-medium">Search Type:</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={searchType === "hybrid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchType("hybrid")}
                    className="flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    Hybrid
                  </Button>
                  <Button
                    type="button"
                    variant={searchType === "semantic" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchType("semantic")}
                    className="flex items-center gap-2"
                  >
                    <Brain className="h-4 w-4" />
                    Semantic
                  </Button>
                  <Button
                    type="button"
                    variant={searchType === "keyword" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchType("keyword")}
                    className="flex items-center gap-2"
                  >
                    <Hash className="h-4 w-4" />
                    Keyword
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                {/* Show All Properties Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch("")}
                  className="flex items-center gap-2"
                >
                  📋 Show All Properties
                </Button>
                
                {/* Direct API Test Button */}
              
              </div>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-fit animate-slide-in">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h3>
              <Separator />

              {/* City */}
              <div className="space-y-2">
                <Label>City</Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="">All Cities</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover max-h-[400px] overflow-y-auto">
                    <SelectItem value="">All Types</SelectItem>
                    
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      🏠 Residential
                    </div>
                    <SelectItem value="flat">Flat / Apartment</SelectItem>
                    <SelectItem value="studio">Studio Apartment</SelectItem>
                    <SelectItem value="1bhk">1BHK</SelectItem>
                    <SelectItem value="2bhk">2BHK</SelectItem>
                    <SelectItem value="3bhk">3BHK</SelectItem>
                    <SelectItem value="4bhk">4BHK</SelectItem>
                    <SelectItem value="independent-house">Independent House</SelectItem>
                    <SelectItem value="builder-floor">Builder Floor</SelectItem>
                    <SelectItem value="duplex">Duplex</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="bungalow">Bungalow</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                    <SelectItem value="row-house">Row House / Townhouse</SelectItem>
                    <SelectItem value="farmhouse">Farmhouse</SelectItem>
                    
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
                      🏘️ Shared Living / Rental
                    </div>
                    <SelectItem value="pg">PG (Paying Guest)</SelectItem>
                    <SelectItem value="co-living">Co-living Space</SelectItem>
                    <SelectItem value="hostel">Hostel</SelectItem>
                    <SelectItem value="shared-apartment">Shared Apartment</SelectItem>
                    <SelectItem value="service-apartment">Service Apartment</SelectItem>
                    <SelectItem value="rent-house">Rent House</SelectItem>
                    <SelectItem value="room-rent">Room on Rent</SelectItem>
                    <SelectItem value="single-room">Single Room</SelectItem>
                    <SelectItem value="sharing">Double/Triple Sharing</SelectItem>
                    
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
                      🏢 Commercial
                    </div>
                    <SelectItem value="office">Office Space</SelectItem>
                    <SelectItem value="coworking">Co-working Space</SelectItem>
                    <SelectItem value="retail">Retail Shop / Showroom</SelectItem>
                    <SelectItem value="commercial-building">Commercial Building</SelectItem>
                    <SelectItem value="mall">Shopping Mall / Complex</SelectItem>
                    <SelectItem value="restaurant">Restaurant / Café</SelectItem>
                    <SelectItem value="warehouse">Warehouse / Godown</SelectItem>
                    <SelectItem value="cold-storage">Cold Storage</SelectItem>
                    <SelectItem value="factory">Factory / Industrial Shed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bedrooms */}
              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <Select value={bedrooms?.toString() || ""} onValueChange={(v) => setBedrooms(v ? parseInt(v) : undefined)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="1">1 BHK</SelectItem>
                    <SelectItem value="2">2 BHK</SelectItem>
                    <SelectItem value="3">3 BHK</SelectItem>
                    <SelectItem value="4">4+ BHK</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <Label>Price Range (₹)</Label>
                <Slider
                  min={0}
                  max={100000000}
                  step={1000000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{(priceRange[0] / 100000).toFixed(0)}L</span>
                  <span>₹{(priceRange[1] / 10000000).toFixed(1)}Cr</span>
                </div>
              </div>

              {/* Area Range */}
              <div className="space-y-4">
                <Label>Area (sq ft)</Label>
                <Slider
                  min={0}
                  max={5000}
                  step={100}
                  value={areaRange}
                  onValueChange={setAreaRange}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{areaRange[0]} sq ft</span>
                  <span>{areaRange[1]} sq ft</span>
                </div>
              </div>

              <Button className="w-full btn-primary" onClick={() => handleSearch()}>
                Apply Filters
              </Button>
            </div>
          )}

          {/* Results */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
          

            {/* Results Count */}
            {totalResults > 0 && (
              <div className="mb-6">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Found <span className="font-bold text-gray-900 dark:text-white">{totalResults}</span> properties
                </p>
              </div>
            )}

            {/* Property Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : properties && properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id || property.property_id} property={property} showCompareButton />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <SearchIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No results yet</h3>
                <p className="text-gray-600 dark:text-gray-400">Try searching for properties using the search bar above</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Search;
