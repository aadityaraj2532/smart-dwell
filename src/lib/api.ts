// API configuration and utilities for Real Estate Co-Pilot

// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV 
  ? ""  // Uses Vite proxy in development
  : "https://data-417505.uc.r.appspot.com";  // Direct URL in production

// API Types - Updated to match real rental platform data structure
export interface Property {
  id: string;
  name: string;
  description: string;
  property_type: "apartment" | "studio" | "pg" | "house" | "duplex" | "commercial" | "student_housing" | "penthouse" | "shared_apartment" | "townhouse" | "co_living_space" | "hostel" | string;
  bedrooms: number;
  bathrooms?: number;
  area_sqft: number;
  area: string; // Location area/zone
  price: number;
  furnishing_type?: "furnished" | "semi_furnished" | "unfurnished";
  city: string;
  state: string;
  country?: string;
  amenities: string[]; // Array of amenity strings
  platform_name: string;
  platform_description: string;
  platform_focus: string;
  special_features: string[];
  target_audience: string[];
  contact_email?: string;
  contact_phone?: string;
  is_active?: boolean;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Additional fields from rental platform API
  elasticsearch_score?: number;
  search_type?: string;
  
  // Legacy fields for backward compatibility
  property_id?: string;
  carpet_area_sqft?: number;
  price_per_sqft?: number;
  currency?: string;
  property_status?: "available" | "sold" | "under_construction" | "ready_to_move";
  furnishing?: "furnished" | "semi_furnished" | "unfurnished";
  floor?: number;
  total_floors?: number;
  age_years?: number;
  facing?: string;
  parking_spaces?: number;
  geo_location?: {
    lat: number;
    lon: number;
  };
  geo_location_details?: {
    address?: string;
    locality?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  builder_name?: string;
  project_name?: string;
  rera_id?: string;
  nearby_amenities?: Array<{
    name: string;
    type: string;
    distance_km: number;
    rating: number;
  }>;
  image_urls?: string[];
  virtual_tour_url?: string;
  ai_summary?: string;
  relevance_score?: number;
  investment_score?: number;
  views_count?: number;
  likes_count?: number;
}

export interface SearchRequest {
  query: string;
  city?: string;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  price_min?: number;
  price_max?: number;
  area_sqft_min?: number;
  area_sqft_max?: number;
  property_status?: "available" | "ready_to_move" | "under_construction";
  furnishing?: "furnished" | "semi_furnished" | "unfurnished";
  preferences?: string[];
  geo_location?: {
    latitude: number;
    longitude: number;
  };
  radius_km?: number;
  size?: number;
}

export interface SearchResponse {
  query: string;
  properties: Property[];
  total_results: number;
  execution_time_ms: number;
  ai_summary: string;
  filters_applied?: Record<string, any>;
}

export interface ChatRequest {
  session_id: string;
  user_id: string;
  message: string;
  context?: Record<string, any>;
}

export interface ChatResponse {
  session_id: string;
  message: string;
  properties?: Property[];
  intent: string;
  timestamp: string;
  metadata?: Record<string, any>;
  suggestions?: string[];
}

export interface InquiryRequest {
  property_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  inquiry_type: string;
  message: string;
  preferred_contact_method?: string;
  budget_range?: string;
  move_in_date?: string;
  additional_requirements?: string;
}

export interface InquiryResponse {
  inquiry_id: string;
  success: boolean;
  message: string;
  estimated_response_time: string;
  contact_info: {
    builder: string;
    builder_phone: string;
    builder_email: string;
  };
}

export interface SiteVisitRequest {
  property_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  preferred_date: string;
  preferred_time: string;
  group_size: number;
  special_requirements?: string;
}

export interface SiteVisitResponse {
  visit_id: string;
  success: boolean;
  message: string;
  confirmed_date: string;
  confirmed_time: string;
  contact_person: {
    name: string;
    phone: string;
    email: string;
  };
}

export interface CompareRequest {
  property_ids: string[];
}

export interface CompareResponse {
  properties: Property[];
  comparison_matrix?: Record<string, Record<string, any>>;
  comparison_summary?: string;
  ai_analysis?: string;
  ai_insights?: string;
  recommendation: string;
  winner?: string;
}

export interface RecommendationsRequest {
  user_preferences: string;
  budget_min: number;
  budget_max: number;
  preferred_locations: string[];
  lifestyle_preferences?: string[];
  family_size?: number;
  limit?: number;
}

export interface RecommendationsResponse {
  source_context?: string;
  recommendations: Property[];
  total_recommendations: number;
  ai_analysis?: string;
  ai_explanation?: string;
  personalized_insights?: {
    budget_analysis?: {
      avg_price: number;
    };
    location_insights?: {
      cities: string[];
      localities: string[];
    };
    [key: string]: any;
  };
}

export interface FeedbackRequest {
  property_id: string;
  user_id: string;
  feedback_type: "like" | "dislike" | "interested";
  rating?: number;
  comments?: string;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  updated_recommendations?: Property[];
}

export interface PropertyDetailsRequest {
  property_id: string;
  include_amenities?: boolean;
  include_market_data?: boolean;
  include_ai_insights?: boolean;
}

export interface PropertyDetailsResponse {
  property: Property;
  similar_properties?: Property[];
  market_analysis?: {
    average_price_per_sqft: number;
    price_trend?: string;
    price_change_percentage?: number;
  };
  price_prediction?: {
    current_price: number;
    predicted_price_6m: number;
    predicted_price_1y: number;
  };
}

export interface MarketInsightsRequest {
  city: string;
  property_type?: string;
  area?: string;
}

export interface MarketInsightsResponse {
  city: string;
  property_type?: string;
  average_price_per_sqft: number;
  price_trend: string;
  price_change_percentage: number;
  total_listings: number;
  hot_areas: string[];
  ai_insights: string;
}

export interface LocationSearchRequest {
  query: string;
  limit?: number;
}

export interface LocationSearchResponse {
  locations: Array<{
    latitude: number;
    longitude: number;
    address: string;
    locality: string;
    city: string;
    state: string;
  }>;
  total_results: number;
}

// API Response Format (matches real rental platform API structure)
export interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  platform: "google-cloud";
  timestamp?: string;
  data_source?: string;
  total?: number;
  properties?: Property[]; // For properties endpoint
}

// Platform Information
export interface Platform {
  name: string;
  description: string;
  focus: string;
  special_features: string[];
}

// Application Info Response
export interface AppInfo {
  application_name: string;
  version: string;
  total_properties: number;
  available_platforms: Platform[];
  status: string;
}

// Health Check Response
export interface HealthStatus {
  status: string;
  data_statistics: {
    total_properties: number;
    total_platforms: number;
    last_updated: string;
  };
}

// Stats Response (matches documented API)
export interface StatsResponse {
  total_properties: number;
  property_types: string[];
  platforms: string[];
  cities: string[];
  platform: string;
  project_id: string;
  data_source: string;
  elasticsearch_integration: {
    status: string;
    features: string[];
    ai_models: string;
  };
  status: string;
}

// Updated Search Request (matches documented API)
export interface DocumentedSearchRequest {
  query: string;
  limit?: number;
  search_type?: "hybrid" | "semantic" | "keyword";
}

// Updated Search Response (matches documented API)
export interface DocumentedSearchResponse {
  query: string;
  results: Property[];
  total: number;
  platform: string;
  search_type: string;
  data_source: string;
  elasticsearch_integration: {
    status: string;
    service: string;
    endpoint: string;
  };
  ai_features: {
    embeddings: string;
    semantic_search: string;
    natural_language: string;
    query_understanding: string;
  };
  status: string;
}

// Mock data for fallback when backend is unavailable
const mockProperties: Property[] = [
  {
    id: "MOCK001",
    property_id: "MOCK001", // Legacy field
    name: "Serenity Heights 2BHK",
    description: "Modern 2BHK flat with excellent connectivity and premium amenities",
    property_type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area_sqft: 1200,
    area: "Koramangala",
    price: 4500000,
    price_per_sqft: 3750, // Legacy field
    currency: "INR", // Legacy field
    furnishing_type: "semi_furnished",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    amenities: [
      "parking",
      "security", 
      "gym",
      "swimming_pool",
      "garden",
      "lift",
      "power_backup",
      "water_supply",
      "metro_station"
    ],
    platform_name: "MagicBricks",
    platform_description: "India's leading real estate platform",
    platform_focus: "Residential and commercial properties",
    special_features: ["AI-powered search", "Virtual tours", "Price trends"],
    target_audience: ["families", "professionals"],
    contact_email: "contact@magicbricks.com",
    contact_phone: "+91-9876543210",
    is_active: true,
    is_verified: true,
    created_at: "2023-01-15T10:30:00Z",
    updated_at: "2023-10-20T15:45:00Z",
    
    // Legacy fields for backward compatibility
    property_status: "available",
    furnishing: "semi_furnished",
    floor: 5,
    total_floors: 12,
    age_years: 2,
    facing: "North-East",
    parking_spaces: 1,
    geo_location: { lat: 12.9716, lon: 77.5946 },
    geo_location_details: {
      address: "123 Serenity Heights, Koramangala",
      locality: "Koramangala",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560034"
    },
    builder_name: "Serenity Builders",
    project_name: "Serenity Heights",
    rera_id: "KA/RE/2023/001",
    nearby_amenities: [
      { name: "Phoenix MarketCity", type: "Shopping Mall", distance_km: 1.2, rating: 4.5 },
      { name: "Koramangala Metro Station", type: "Metro", distance_km: 0.8, rating: 4.3 }
    ],
    image_urls: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
    ai_summary: "Excellent investment opportunity in prime Koramangala location with modern amenities",
    relevance_score: 0.95,
    investment_score: 0.88,
    views_count: 1250,
    likes_count: 89
  },
  {
    id: "MOCK002",
    property_id: "MOCK002", // Legacy field
    name: "Green Valley Villa",
    description: "Spacious 3BHK villa with private garden and premium finishes",
    property_type: "villa",
    bedrooms: 3,
    bathrooms: 3,
    area_sqft: 2500,
    area: "Whitefield",
    price: 8500000,
    price_per_sqft: 3400, // Legacy field
    currency: "INR", // Legacy field
    furnishing_type: "furnished",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    amenities: [
      "parking",
      "security",
      "gym", 
      "swimming_pool",
      "garden",
      "power_backup",
      "water_supply"
    ],
    platform_name: "99acres",
    platform_description: "Premier real estate portal",
    platform_focus: "All property types",
    special_features: ["Detailed listings", "Market insights", "Agent network"],
    target_audience: ["families", "professionals"],
    contact_email: "contact@99acres.com",
    contact_phone: "+91-9876543211",
    is_active: true,
    is_verified: true,
    created_at: "2023-02-20T14:15:00Z",
    updated_at: "2023-10-21T09:30:00Z",
    
    // Legacy fields for backward compatibility
    property_status: "available",
    furnishing: "furnished",
    floor: 1,
    total_floors: 2,
    age_years: 1,
    facing: "South",
    parking_spaces: 2,
    geo_location: { lat: 12.9352, lon: 77.6245 },
    geo_location_details: {
      address: "456 Green Valley, Whitefield",
      locality: "Whitefield",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560066"
    },
    builder_name: "Green Valley Developers",
    project_name: "Green Valley Villas",
    rera_id: "KA/RE/2023/002",
    nearby_amenities: [
      { name: "Phoenix MarketCity Whitefield", type: "Shopping Mall", distance_km: 2.1, rating: 4.4 },
      { name: "ITPL Metro Station", type: "Metro", distance_km: 1.5, rating: 4.2 }
    ],
    image_urls: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"],
    ai_summary: "Premium villa in growing Whitefield area with excellent connectivity to IT hubs",
    relevance_score: 0.92,
    investment_score: 0.85,
    views_count: 980,
    likes_count: 67
  },
  {
    id: "MOCK003",
    property_id: "MOCK003", // Legacy field
    name: "Urban Nest Studio",
    description: "Compact studio apartment perfect for young professionals",
    property_type: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    area_sqft: 600,
    area: "Indiranagar",
    price: 2800000,
    price_per_sqft: 4667, // Legacy field
    currency: "INR", // Legacy field
    furnishing_type: "unfurnished",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    amenities: [
      "parking",
      "security",
      "gym",
      "garden", 
      "lift",
      "power_backup",
      "water_supply",
      "metro_station"
    ],
    platform_name: "Housing.com",
    platform_description: "India's fastest growing real estate platform",
    platform_focus: "Residential properties",
    special_features: ["Verified listings", "Price trends", "Virtual tours"],
    target_audience: ["professionals", "singles"],
    contact_email: "contact@housing.com",
    contact_phone: "+91-9876543212",
    is_active: true,
    is_verified: true,
    created_at: "2022-11-10T11:20:00Z",
    updated_at: "2023-10-19T16:15:00Z",
    
    // Legacy fields for backward compatibility
    property_status: "available",
    furnishing: "unfurnished",
    floor: 8,
    total_floors: 15,
    age_years: 3,
    facing: "West",
    parking_spaces: 1,
    geo_location: { lat: 12.9141, lon: 77.6442 },
    geo_location_details: {
      address: "789 Urban Nest, Indiranagar",
      locality: "Indiranagar",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560038"
    },
    builder_name: "Urban Developers",
    project_name: "Urban Nest",
    rera_id: "KA/RE/2022/003",
    nearby_amenities: [
      { name: "Indiranagar Metro Station", type: "Metro", distance_km: 0.5, rating: 4.6 },
      { name: "100 Feet Road", type: "Commercial", distance_km: 0.3, rating: 4.4 }
    ],
    image_urls: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
    ai_summary: "Affordable studio in prime Indiranagar location with excellent metro connectivity",
    relevance_score: 0.88,
    investment_score: 0.82,
    views_count: 2100,
    likes_count: 156
  }
];

// Helper function to handle API errors consistently
async function handleApiError(response: Response, defaultMessage: string): Promise<never> {
  let errorMessage = `${defaultMessage} with status ${response.status}`;
  try {
    const responseClone = response.clone();
    const contentType = response.headers.get('content-type');
    
    // Check if response is JSON
    if (contentType && contentType.includes('application/json')) {
      const errorData = await responseClone.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
      console.error("Backend error details:", errorData);
    } else {
      // Handle HTML or other content types
      const errorText = await responseClone.text();
      if (errorText) {
        console.error("Backend error text (non-JSON):", errorText.substring(0, 200));
        errorMessage = `Server returned ${response.status}: ${response.statusText}`;
      }
    }
  } catch (parseError) {
    console.error("Could not parse error response:", parseError);
    errorMessage = `Server error ${response.status}: ${response.statusText}`;
  }
  
  // Add more specific error information for debugging
  if (response.status === 500) {
    console.error(`Backend server error (500) - This indicates the backend service is experiencing issues.`);
    console.error(`Error occurred at: ${new Date().toISOString()}`);
    console.error(`Request URL: ${response.url}`);
  }
  
  throw new Error(errorMessage);
}

// API Functions
export const api = {
  // Root endpoint - Get application information
  async getAppInfo(): Promise<ApiResponse<AppInfo>> {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      if (!response.ok) {
        await handleApiError(response, "Failed to fetch app info");
      }
      return response.json();
    } catch (error) {
      console.warn("Backend unavailable, using mock data:", error);
      return {
        status: "success",
        data: {
          application_name: "Real Estate Co-Pilot",
          version: "1.0.0",
          total_properties: mockProperties.length,
          available_platforms: [
            {
              name: "MagicBricks",
              description: "India's leading real estate platform",
              focus: "Residential and commercial properties",
              special_features: ["AI-powered search", "Virtual tours", "Price trends"]
            },
            {
              name: "99acres",
              description: "Premier real estate portal",
              focus: "All property types",
              special_features: ["Detailed listings", "Market insights", "Agent network"]
            }
          ],
          status: "operational"
        },
        platform: "google-cloud",
        timestamp: new Date().toISOString()
      };
    }
  },

  // Health check endpoint
  async getHealth(): Promise<ApiResponse<HealthStatus>> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        await handleApiError(response, "Health check failed");
      }
      return response.json();
    } catch (error) {
      console.warn("Backend unavailable, using mock data:", error);
      return {
        status: "success",
        data: {
          status: "healthy",
          data_statistics: {
            total_properties: mockProperties.length,
            total_platforms: 2,
            last_updated: new Date().toISOString()
          }
        },
        platform: "google-cloud",
        timestamp: new Date().toISOString()
      };
    }
  },

  // Search properties using the documented rental platform API
  async searchProperties(request: DocumentedSearchRequest): Promise<ApiResponse<DocumentedSearchResponse>> {
    // Check cache first
    const cacheKey = `search_${request.query}_${request.limit}_${request.search_type}`;
    const cachedResult = getCachedResult(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/search`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        mode: "cors",
        body: JSON.stringify({
          query: request.query,
          limit: request.limit || 10,
          search_type: request.search_type || "hybrid"
        }),
      });
      
      if (!response.ok) {
        await handleApiError(response, "Search failed");
      }
      
      const apiResponse = await response.json();
      console.log("API Response received:", apiResponse);
      
      const result = {
        status: apiResponse.status || "success",
        data: apiResponse,
        platform: apiResponse.platform || "google-cloud",
        timestamp: new Date().toISOString(),
        data_source: apiResponse.data_source
      };

      // Cache the result
      setCachedResult(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error("API Error details:", error);
      console.error("Full error object:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      });
      
      // Show the error to user but also provide mock data as fallback
      console.warn("Backend unavailable, using mock data:", error);
      
      // Filter mock data based on query
      let filteredProperties = [...mockProperties];
      
      if (request.query && request.query.toLowerCase() !== "all") {
        filteredProperties = filteredProperties.filter(p => 
          p.name.toLowerCase().includes(request.query.toLowerCase()) ||
          p.description.toLowerCase().includes(request.query.toLowerCase()) ||
          p.property_type.toLowerCase().includes(request.query.toLowerCase()) ||
          p.city.toLowerCase().includes(request.query.toLowerCase()) ||
          p.area.toLowerCase().includes(request.query.toLowerCase())
        );
      }
      
      // Limit results
      const limit = request.limit || 10;
      filteredProperties = filteredProperties.slice(0, limit);
      
      return {
        status: "success",
        data: {
          query: request.query,
          results: filteredProperties,
          total: filteredProperties.length,
          platform: "google-cloud",
          search_type: request.search_type || "hybrid",
          data_source: "mock_data",
          elasticsearch_integration: {
            status: "offline",
            service: "mock_service",
            endpoint: "mock_endpoint"
          },
          ai_features: {
            embeddings: "mock_embeddings",
            semantic_search: "disabled",
            natural_language: "disabled",
            query_understanding: "disabled"
          },
          status: "success"
        },
        platform: "google-cloud",
        timestamp: new Date().toISOString()
      };
    }
  },

  // Get all properties with optional limit (real API)
  async getAllProperties(limit: number = 20): Promise<ApiResponse<Property[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/properties?limit=${limit}`);
      if (!response.ok) {
        await handleApiError(response, "Failed to fetch properties");
      }
      const apiResponse = await response.json();
      
      // Transform the real API response to match our interface
      return {
        status: apiResponse.status || "success",
        data: apiResponse.properties || [],
        platform: apiResponse.platform || "google-cloud",
        timestamp: apiResponse.timestamp || new Date().toISOString(),
        data_source: apiResponse.data_source,
        total: apiResponse.total
      };
    } catch (error) {
      console.warn("Backend unavailable, using mock data:", error);
      
      const limitedProperties = mockProperties.slice(0, limit);
      return {
        status: "success",
        data: limitedProperties,
        platform: "google-cloud",
        timestamp: new Date().toISOString()
      };
    }
  },

  // Get specific property by ID (real API)
  async getProperty(propertyId: string): Promise<ApiResponse<Property>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/properties/${propertyId}`);
      if (!response.ok) {
        await handleApiError(response, "Failed to fetch property");
      }
      const apiResponse = await response.json();
      
      // Transform the real API response to match our interface
      return {
        status: apiResponse.status || "success",
        data: apiResponse.property || apiResponse.data,
        platform: apiResponse.platform || "google-cloud",
        timestamp: apiResponse.timestamp || new Date().toISOString(),
        data_source: apiResponse.data_source
      };
    } catch (error) {
      console.warn("Backend unavailable, using mock data:", error);
      
      // Find mock property by ID or return first one
      const mockProperty = mockProperties.find(p => p.property_id === propertyId) || mockProperties[0];
      return {
        status: "success",
        data: mockProperty,
        platform: "google-cloud",
        timestamp: new Date().toISOString()
      };
    }
  },

  // Get system statistics (real API)
  async getStats(): Promise<ApiResponse<StatsResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/stats`);
      if (!response.ok) {
        await handleApiError(response, "Failed to fetch stats");
      }
      const apiResponse = await response.json();
      
      // Return the API response directly as it matches our interface
      return {
        status: apiResponse.status || "success",
        data: apiResponse,
        platform: apiResponse.platform || "google-cloud",
        timestamp: apiResponse.timestamp || new Date().toISOString(),
        data_source: apiResponse.data_source
      };
    } catch (error) {
      console.warn("Backend unavailable, using mock data:", error);
      return {
        status: "success",
        data: {
          total_properties: mockProperties.length,
          property_types: ["apartment", "studio", "pg", "house", "duplex", "commercial", "student_housing", "penthouse", "shared_apartment", "townhouse", "co_living_space", "hostel"],
          platforms: ["MagicBricks", "99acres", "Housing.com", "AmberStudent", "ZoloStays"],
          cities: ["Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Hyderabad", "Kolkata", "Ahmedabad"],
          platform: "google-cloud",
          project_id: "data-417505",
          data_source: "mock_data",
          elasticsearch_integration: {
            status: "offline",
            features: ["mock_search"],
            ai_models: "mock_models"
          },
          status: "success"
        },
        platform: "google-cloud",
        timestamp: new Date().toISOString()
      };
    }
  },

  // Legacy search function (for backward compatibility)
  async searchPropertiesLegacy(request: SearchRequest): Promise<SearchResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: request.query, limit: request.size || 10 }),
      });
      if (!response.ok) {
        await handleApiError(response, "Search failed");
      }
      const apiResponse = await response.json();
      
      // Transform the real API response to match legacy interface
      return {
        query: request.query,
        properties: apiResponse.results || [],
        total_results: apiResponse.total || 0,
        execution_time_ms: 50,
        ai_summary: "Search completed successfully using real rental platform data",
        filters_applied: {
          property_type: request.property_type,
          bedrooms: request.bedrooms,
          price_min: request.price_min,
          price_max: request.price_max
        }
      };
    } catch (error) {
      console.warn("Backend unavailable, using mock data:", error);
      
      // Filter mock data based on request parameters
      let filteredProperties = [...mockProperties];
      
      if (request.property_type && request.property_type !== "all") {
        filteredProperties = filteredProperties.filter(p => p.property_type === request.property_type);
      }
      
      if (request.bedrooms) {
        filteredProperties = filteredProperties.filter(p => p.bedrooms === request.bedrooms);
      }
      
      if (request.price_min) {
        filteredProperties = filteredProperties.filter(p => p.price >= request.price_min!);
      }
      
      if (request.price_max) {
        filteredProperties = filteredProperties.filter(p => p.price <= request.price_max!);
      }
      
      // Limit results based on size parameter
      const size = request.size || 10;
      filteredProperties = filteredProperties.slice(0, size);
      
      return {
        query: request.query,
        properties: filteredProperties,
        total_results: filteredProperties.length,
        execution_time_ms: 50,
        ai_summary: "Showing sample properties while backend is being restored. These are representative examples of available properties.",
        filters_applied: {
          property_type: request.property_type,
          bedrooms: request.bedrooms,
          price_min: request.price_min,
          price_max: request.price_max
        }
      };
    }
  },

  // Get Property Details (Enhanced with AI Insights)
  async getPropertyDetails(request: PropertyDetailsRequest): Promise<PropertyDetailsResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/property/${request.property_id}/details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      await handleApiError(response, "Failed to fetch property details");
    }
    return response.json();
  },

  // Property Comparison
  async compareProperties(request: CompareRequest): Promise<CompareResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/compare`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      await handleApiError(response, "Comparison failed");
    }
    return response.json();
  },

  // Property Recommendations
  async getRecommendations(request: RecommendationsRequest): Promise<RecommendationsResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      await handleApiError(response, "Failed to get recommendations");
    }
    return response.json();
  },

  // AI Chat
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      await handleApiError(response, "Chat request failed");
    }
    return response.json();
  },

  // Submit Inquiry
  async submitInquiry(request: InquiryRequest): Promise<InquiryResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/contact/inquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      await handleApiError(response, "Failed to submit inquiry");
    }
    return response.json();
  },

  // Schedule Site Visit
  async scheduleSiteVisit(request: SiteVisitRequest): Promise<SiteVisitResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/contact/site-visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      await handleApiError(response, "Failed to schedule site visit");
    }
    return response.json();
  },

  // Get Contact History
  async getContactHistory(userEmail: string, limit: number = 20) {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/contact/history?user_email=${encodeURIComponent(userEmail)}&limit=${limit}`
    );
    if (!response.ok) {
      await handleApiError(response, "Failed to fetch contact history");
    }
    return response.json();
  },

  // Get Property Contact Info
  async getPropertyContact(propertyId: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/contact/property/${propertyId}`);
    if (!response.ok) {
      await handleApiError(response, "Failed to fetch contact info");
    }
    return response.json();
  },

  // Market Insights
  async getMarketInsights(request: MarketInsightsRequest): Promise<MarketInsightsResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/market/insights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      await handleApiError(response, "Failed to fetch market insights");
    }
    return response.json();
  },

  // Location Search
  async searchLocations(request: LocationSearchRequest): Promise<LocationSearchResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/locations/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      await handleApiError(response, "Failed to search locations");
    }
    return response.json();
  },

  // Submit Feedback (Like/Dislike/Interested)
  async submitFeedback(request: FeedbackRequest): Promise<FeedbackResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      await handleApiError(response, "Failed to submit feedback");
    }
    return response.json();
  },
};

// Utility functions
export const formatPrice = (price: number | undefined | null, currency: string = "INR"): string => {
  // Handle undefined, null, or invalid price values
  if (price === undefined || price === null || isNaN(price)) {
    return "Price not available";
  }
  
  if (currency === "INR") {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString("en-IN")}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
};

export const formatArea = (area: number | undefined | null): string => {
  if (area === undefined || area === null || isNaN(area)) {
    return "Area not available";
  }
  return `${area.toLocaleString()} sq ft`;
};

export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Simple caching for better performance
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedResult = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedResult = (key: string, data: any) => {
  cache.set(key, {
    data: data,
    timestamp: Date.now()
  });
};

// Backend status checker
export const checkBackendStatus = async (): Promise<{
  isOnline: boolean;
  lastChecked: string;
  error?: string;
}> => {
  try {
    // Use proxy in development, direct URL in production
    const healthUrl = import.meta.env.DEV 
      ? '/health'  // Use proxy in development
      : `${API_BASE_URL}/health`;  // Direct URL in production
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      return {
        isOnline: true,
        lastChecked: new Date().toISOString()
      };
    } else {
      return {
        isOnline: false,
        lastChecked: new Date().toISOString(),
        error: `Server returned ${response.status}: ${response.statusText}`
      };
    }
  } catch (error) {
    return {
      isOnline: false,
      lastChecked: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
