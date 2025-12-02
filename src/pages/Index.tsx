import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MessageSquare, TrendingUp, CheckCircle2, ArrowRight, Loader2, Server, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import BackendStatusBanner from "@/components/BackendStatusBanner";
import { Property, api, AppInfo, HealthStatus, StatsResponse, checkBackendStatus } from "@/lib/api";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [apiStatus, setApiStatus] = useState<{
    appInfo?: AppInfo;
    health?: HealthStatus;
    stats?: StatsResponse;
    backendStatus?: {
      isOnline: boolean;
      lastChecked: string;
      error?: string;
    };
    loading: boolean;
  }>({ loading: true });

  // Fetch real properties from backend using new documented API
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        // Try the new documented API first
        const response = await api.searchProperties({
          query: "featured properties",
          limit: 6,
          search_type: "hybrid"
        });
        setFeaturedProperties(response.data.results || []);
      } catch (error) {
        console.error("Error fetching featured properties:", error);
        // Fallback to legacy API
        try {
          const legacyResponse = await api.searchPropertiesLegacy({
            query: "featured properties",
            size: 6,
          });
          setFeaturedProperties(legacyResponse.properties || []);
        } catch (legacyError) {
          console.error("Legacy API also failed:", legacyError);
          setFeaturedProperties([]);
        }
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  // Fetch API status information
  useEffect(() => {
    const fetchApiStatus = async () => {
      try {
        // Check backend status first
        const backendStatus = await checkBackendStatus();
        
        const [appInfoResponse, healthResponse, statsResponse] = await Promise.all([
          api.getAppInfo(),
          api.getHealth(),
          api.getStats()
        ]);

        setApiStatus({
          appInfo: appInfoResponse.data,
          health: healthResponse.data,
          stats: statsResponse.data,
          backendStatus,
          loading: false
        });
      } catch (error) {
        console.error("Error fetching API status:", error);
        
        // Check backend status even when API calls fail
        const backendStatus = await checkBackendStatus();
        
        // Set fallback data instead of empty state
        setApiStatus({ 
          loading: false,
          backendStatus,
          appInfo: {
            application_name: "Real Estate Co-Pilot",
            version: "1.0.0",
            total_properties: 0,
            available_platforms: [],
            status: backendStatus.isOnline ? "operational" : "offline"
          },
          health: {
            status: backendStatus.isOnline ? "healthy" : "offline",
            data_statistics: {
              total_properties: 0,
              total_platforms: 0,
              last_updated: new Date().toISOString()
            }
          },
          stats: {
            total_properties: 0,
            platforms: [],
            property_types: [],
            cities: [],
            platform: "offline",
            project_id: "unknown",
            data_source: "offline",
            elasticsearch_integration: {
              status: "offline",
              features: [],
              ai_models: "none"
            },
            status: "offline"
          }
        });
      }
    };

    fetchApiStatus();
  }, []);

  // Backup mock properties (kept commented as fallback)
  const mockProperties: Property[] = [
    {
      id: "PROP001",
      property_id: "PROP001",
      name: "Serenity Heights 2BHK",
      description: "Modern 2BHK flat with excellent connectivity",
      property_type: "apartment",
      bedrooms: 2,
      bathrooms: 2,
      area_sqft: 1050,
      area: "Kharadi",
      price: 5500000,
      price_per_sqft: 5238,
      currency: "INR",
      furnishing_type: "semi_furnished",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      amenities: ["parking", "security", "gym", "swimming_pool"],
      platform_name: "Mock Platform",
      platform_description: "Mock platform for testing",
      platform_focus: "Residential",
      special_features: ["Modern amenities"],
      target_audience: ["families"],
      contact_email: "contact@mock.com",
      contact_phone: "+91-9876543210",
      is_active: true,
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      geo_location: { lat: 18.5204, lon: 73.8567 },
      geo_location_details: {
        address: "Kharadi, Pune",
        locality: "Kharadi",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411014",
      },
      builder_name: "Lodha Group",
      investment_score: 8.5,
      relevance_score: 0.95,
    },
    {
      id: "PROP002",
      property_id: "PROP002",
      name: "Green Valley Villa",
      description: "Luxurious 3BHK villa with garden",
      property_type: "villa",
      bedrooms: 3,
      bathrooms: 3,
      area_sqft: 2200,
      area: "Baner",
      price: 12500000,
      price_per_sqft: 5682,
      currency: "INR",
      furnishing_type: "furnished",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      amenities: ["parking", "security", "gym", "swimming_pool"],
      platform_name: "Mock Platform",
      platform_description: "Mock platform for testing",
      platform_focus: "Residential",
      special_features: ["Luxury amenities"],
      target_audience: ["families"],
      contact_email: "contact@mock.com",
      contact_phone: "+91-9876543211",
      is_active: true,
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      geo_location: { lat: 18.5195, lon: 73.9290 },
      geo_location_details: {
        address: "Baner, Pune",
        locality: "Baner",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411045",
      },
      builder_name: "Godrej Properties",
      investment_score: 9.2,
      relevance_score: 0.92,
    },
    {
      id: "PROP003",
      property_id: "PROP003",
      name: "Sky Tower Penthouse",
      description: "Premium 4BHK penthouse with panoramic views",
      property_type: "apartment",
      bedrooms: 4,
      bathrooms: 4,
      area_sqft: 3500,
      area: "Worli",
      price: 25000000,
      price_per_sqft: 7143,
      currency: "INR",
      furnishing_type: "furnished",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      amenities: ["parking", "security", "gym", "swimming_pool"],
      platform_name: "Mock Platform",
      platform_description: "Mock platform for testing",
      platform_focus: "Luxury Residential",
      special_features: ["Premium amenities"],
      target_audience: ["luxury buyers"],
      contact_email: "contact@mock.com",
      contact_phone: "+91-9876543212",
      is_active: true,
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      geo_location: { lat: 19.0760, lon: 72.8777 },
      geo_location_details: {
        address: "Worli, Mumbai",
        locality: "Worli",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400018",
      },
      builder_name: "Oberoi Realty",
      investment_score: 8.8,
      relevance_score: 0.90,
    },
  ];

  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description: "AI-powered search with natural language understanding and personalized results",
    },
    {
      icon: MessageSquare,
      title: "AI Chat Assistant",
      description: "Conversational property discovery with intelligent recommendations",
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Real-time market analysis and investment scoring powered by AI",
    },
  ];

  const benefits = [
    "Hybrid search with vector similarity and keyword matching",
    "AI-generated property summaries and recommendations",
    "Geo-location based filtering and nearby amenities",
    "Side-by-side property comparison with insights",
    "Automated inquiries and site visit scheduling",
    "Market trends and investment potential analysis",
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        // Use the new documented API for search
        const response = await api.searchProperties({
          query: searchQuery.trim(),
          limit: 20,
          search_type: "hybrid"
        });
        
        // Navigate to search results with the data
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`, {
          state: { searchResults: response.data.results }
        });
      } catch (error) {
        console.error("Search failed:", error);
        // Fallback to legacy search
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section - UrbanNest Style */}
      <section 
        className="relative flex items-center justify-center min-h-[60vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 100%), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920')"
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tighter">
              Find your perfect place, intelligently
            </h1>
            <p className="mt-4 text-base sm:text-lg font-light max-w-xl mx-auto">
              Our AI-powered search understands you. Just tell us what you're looking for.
            </p>
          </div>
          
          <div className="mt-8 mx-auto max-w-3xl">
            <form onSubmit={handleSearch} className="flex w-full items-stretch rounded-xl shadow-2xl bg-gradient-to-r from-primary/10 to-primary/20 dark:from-primary/20 dark:to-primary/30 p-2 border border-primary/20">
              <div className="relative flex-grow">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-primary">
                  <Search className="h-6 w-6" />
                </span>
                <Input
                  type="text"
                  placeholder="Try 'pet-friendly apartments near downtown with a balcony'"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full resize-none rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-0 border-none bg-transparent placeholder-gray-500 dark:placeholder-gray-400 pl-12 pr-4 py-3 text-base font-normal"
                />
              </div>
              <Button 
                type="submit" 
                className="flex-shrink-0 inline-flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold tracking-wide shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-all hover:scale-105"
              >
                Search
              </Button>
            </form>
            
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
              <span className="bg-white/20 text-white px-3 py-1 rounded-full">Personalized Recommendations</span>
              <span className="bg-white/20 text-white px-3 py-1 rounded-full">Intelligent Autocomplete</span>
              <span className="bg-white/20 text-white px-3 py-1 rounded-full">Natural Language</span>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Property Categories - UrbanNest Style */}
      <section className="py-16 sm:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Explore Our Property Categories
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Find the perfect living space that suits your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Apartments */}
            <div className="relative rounded-xl overflow-hidden group shadow-lg cursor-pointer" onClick={() => navigate('/search?q=apartments')}>
              <img 
                alt="Apartments" 
                className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-300" 
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white">Apartments</h3>
                <p className="text-white/80 mt-1">Modern and stylish apartments for urban living.</p>
                <Button className="mt-4 inline-flex items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold tracking-wide shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark transition-all">
                  Browse Apartments
                </Button>
              </div>
            </div>

            {/* PG Accommodations */}
            <div className="relative rounded-xl overflow-hidden group shadow-lg cursor-pointer" onClick={() => navigate('/search?q=PG accommodations')}>
              <img 
                alt="PG Accommodations" 
                className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-300" 
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white">PG Accommodations</h3>
                <p className="text-white/80 mt-1">Affordable and convenient paying guest options.</p>
                <Button className="mt-4 inline-flex items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold tracking-wide shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark transition-all">
                  Explore PGs
                </Button>
              </div>
            </div>

            {/* Co-living Spaces */}
            <div className="relative rounded-xl overflow-hidden group shadow-lg cursor-pointer" onClick={() => navigate('/search?q=co-living spaces')}>
              <img 
                alt="Co-living Spaces" 
                className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-300" 
                src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white">Co-living Spaces</h3>
                <p className="text-white/80 mt-1">Community-focused and vibrant living spaces.</p>
                <Button className="mt-4 inline-flex items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold tracking-wide shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark transition-all">
                  Discover Co-living
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - UrbanNest Style */}
      <section className="py-16 sm:py-24 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Experience a Smarter Search
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Our AI-powered engine finds your perfect home faster and more accurately.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
            {/* Add a 4th feature to match UrbanNest layout */}
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Verified Listings
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                All properties are verified and authenticated for your peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* API Status Section */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              API Status & Platform Information
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Real-time data from our integrated platforms
            </p>
          </div>

          {apiStatus.loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Backend Status Banner */}
              {apiStatus.backendStatus && (
                <BackendStatusBanner
                  isOnline={apiStatus.backendStatus.isOnline}
                  lastChecked={apiStatus.backendStatus.lastChecked}
                  error={apiStatus.backendStatus.error}
                />
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* App Info */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <Server className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Application Info
                  </h3>
                </div>
                {apiStatus.appInfo ? (
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Name:</strong> {apiStatus.appInfo.application_name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Version:</strong> {apiStatus.appInfo.version}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Properties:</strong> {apiStatus.appInfo.total_properties.toLocaleString()}
                    </p>
                    <Badge variant="outline" className="mt-2">
                      {apiStatus.appInfo.status}
                    </Badge>
                  </div>
                ) : (
                  <p className="text-gray-500">Unable to fetch app info</p>
                )}
              </div>

              {/* Health Status */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <Activity className="h-8 w-8 text-green-500 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Health Status
                  </h3>
                </div>
                {apiStatus.health ? (
                  <div className="space-y-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {apiStatus.health.status}
                    </Badge>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Properties:</strong> {apiStatus.health.data_statistics.total_properties.toLocaleString()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Platforms:</strong> {apiStatus.health.data_statistics.total_platforms}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      <strong>Updated:</strong> {new Date(apiStatus.health.data_statistics.last_updated).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">Unable to fetch health status</p>
                )}
              </div>

              {/* Platform Stats */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-8 w-8 text-blue-500 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Platform Stats
                  </h3>
                </div>
                {apiStatus.stats ? (
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Total Properties:</strong> {apiStatus.stats.total_properties.toLocaleString()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Platforms:</strong> {apiStatus.stats.platforms.length}
                    </p>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Supported Platforms:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {apiStatus.stats.platforms.slice(0, 3).map((platform, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                        {apiStatus.stats.platforms.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{apiStatus.stats.platforms.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Unable to fetch platform stats</p>
                )}
              </div>
            </div>
            </>
          )}
        </div>
      </section>

      {/* Featured Properties - UrbanNest Style */}
      <section className="py-16 sm:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Featured Properties
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Discover our handpicked selection of premium listings.
            </p>
          </div>

          {loadingProperties ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id || property.property_id} property={property} showCompareButton />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600 dark:text-gray-400">No featured properties available at the moment.</p>
              <Link to="/search" className="inline-block mt-4">
                <Button>Browse All Properties</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Why Choose <span className="text-primary">RealEstate AI</span>?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our AI-powered platform combines cutting-edge technology with comprehensive real estate data to provide you with the best property search experience.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link to="/search">
                <Button size="lg" className="btn-primary">
                  Start Exploring
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                alt="Modern real estate"
                className="rounded-2xl shadow-2xl hover-lift"
              />
              <div className="absolute -bottom-6 -right-6 bg-secondary text-secondary-foreground p-6 rounded-xl shadow-xl">
                <p className="text-4xl font-bold">10,000+</p>
                <p className="text-sm">Properties Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - UrbanNest Style */}
      <section className="bg-white dark:bg-background-dark py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white max-w-2xl">
              List your property with us
            </h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
              Reach a wider audience and find the right tenants or buyers for your property. It's easy and free!
            </p>
            <Link to="/list-property">
              <Button className="inline-flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold tracking-wide shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-transform hover:scale-105">
                List Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
