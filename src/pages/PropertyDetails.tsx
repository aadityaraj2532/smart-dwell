import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Bed, Bath, Maximize2, Calendar, Compass, Building, ArrowLeft, Phone, Mail, Share2, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api, Property, formatPrice, formatArea } from "@/lib/api";
import { toast } from "sonner";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [siteVisitOpen, setSiteVisitOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadProperty(id);
    }
  }, [id]);

  const loadProperty = async (propertyId: string) => {
    try {
      // Use the real API endpoint for getting property details
      const response = await api.getProperty(propertyId);
      console.log("Property Details API Response:", response);
      console.log("Property amenities:", response.data?.amenities);
      setProperty(response.data);
    } catch (error) {
      console.error("Error loading property:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
      
      // Check if it's a validation error (missing geo_location)
      if (errorMsg.includes("geo_location") || errorMsg.includes("validation error")) {
        toast.error("Property data is incomplete. Some location details may be missing.");
        // Set a minimal property object to prevent complete failure
        setProperty({
          id: propertyId,
          property_id: propertyId, // Legacy field
          name: "Property Details Unavailable",
          description: "Property details are currently unavailable",
          price: 0,
          currency: "INR", // Legacy field
          bedrooms: 0,
          bathrooms: 0,
          area_sqft: 0,
          area: "Unknown",
          property_type: "unknown",
          furnishing_type: "unfurnished",
          city: "Unknown",
          state: "Unknown",
          country: "India",
          amenities: [],
          platform_name: "Unknown",
          platform_description: "Unknown platform",
          platform_focus: "Unknown",
          special_features: [],
          target_audience: [],
          contact_email: "contact@example.com",
          contact_phone: "+91-0000000000",
          is_active: false,
          is_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          geo_location_details: {
            address: "Address not available",
            locality: "Location not specified",
            city: "City not specified",
            state: "State not specified",
            pincode: "000000"
          }
        } as Property);
      } else {
        toast.error(`Failed to load property details: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await api.submitInquiry({
        property_id: property!.property_id,
        user_name: formData.get("name") as string,
        user_email: formData.get("email") as string,
        user_phone: formData.get("phone") as string,
        inquiry_type: "property_viewing",
        message: formData.get("message") as string,
        preferred_contact_method: "email",
      });
      
      toast.success("Inquiry submitted successfully! We'll contact you soon.");
      setInquiryOpen(false);
    } catch (error) {
      toast.error("Failed to submit inquiry");
    }
  };

  const handleSiteVisitSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await api.scheduleSiteVisit({
        property_id: property!.property_id,
        user_name: formData.get("name") as string,
        user_email: formData.get("email") as string,
        user_phone: formData.get("phone") as string,
        preferred_date: formData.get("date") as string,
        preferred_time: formData.get("time") as string,
        group_size: parseInt(formData.get("group_size") as string) || 1,
      });
      
      toast.success("Site visit scheduled successfully!");
      setSiteVisitOpen(false);
    } catch (error) {
      toast.error("Failed to schedule site visit");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Property not found</h2>
            <Link to="/search">
              <Button className="btn-primary">Back to Search</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Data Incomplete Warning */}
      {property.name === "Property Details Unavailable" && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                <strong>Notice:</strong> This property has incomplete data. Some details may be missing or unavailable.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1">
        {/* Image Gallery */}
        <div className="relative h-[500px] bg-muted">
          <img
            src={property.image_urls?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920"}
            alt={property.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-6 left-6">
            <Link to="/search">
              <Button variant="outline" className="bg-white/90 hover:bg-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
            </Link>
          </div>
          <div className="absolute top-6 right-6 flex gap-2">
            <Button
              variant="outline"
              className="bg-white/90 hover:bg-white"
              onClick={() => {
                setIsFavorite(!isFavorite);
                toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
              }}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="outline" className="bg-white/90 hover:bg-white">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">{property.name}</h1>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="h-5 w-5" />
                      <span className="text-lg">{property.geo_location_details?.address || 'Address not specified'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-primary">
                      {formatPrice(property.price, property.currency)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatPrice(property.price_per_sqft, property.currency)}/sq ft
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Bed className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</div>
                      <div className="font-bold text-gray-900 dark:text-white">{property.bedrooms}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bath className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</div>
                      <div className="font-bold text-gray-900 dark:text-white">{property.bathrooms}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Maximize2 className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Area</div>
                      <div className="font-semibold">{formatArea(property.area_sqft)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Type</div>
                      <div className="font-semibold capitalize">{property.property_type}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger value="amenities" className="flex-1">Amenities</TabsTrigger>
                  <TabsTrigger value="location" className="flex-1">Location</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 pt-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">About This Property</h3>
                    <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                  </div>

                  {property.ai_summary && (
                    <div className="p-6 bg-secondary/10 border border-secondary/20 rounded-xl">
                      <h3 className="text-lg font-semibold mb-3 text-secondary">AI Insights</h3>
                      <p className="text-muted-foreground leading-relaxed">{property.ai_summary}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Property Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Builder</div>
                        <div className="font-semibold">{property.builder_name}</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Property Type</div>
                        <div className="font-semibold capitalize">{property.property_type}</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="amenities" className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Amenities & Features</h3>
                  {property.amenities && property.amenities.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                          <div className="h-2 w-2 rounded-full bg-secondary" />
                          <span className="capitalize">{amenity.replace(/_/g, " ")}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No amenities information available</p>
                  )}
                </TabsContent>

                <TabsContent value="location" className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Nearby Amenities</h3>
                  {property.nearby_amenities && property.nearby_amenities.length > 0 ? (
                    <div className="space-y-3">
                      {property.nearby_amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div>
                            <div className="font-semibold">{amenity.name}</div>
                            <div className="text-sm text-muted-foreground capitalize">{amenity.type.replace(/_/g, " ")}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{amenity.distance_km} km</div>
                            <div className="text-sm text-muted-foreground">Rating: {amenity.rating}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No nearby amenities information available</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Contact Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="p-6 bg-card border border-border rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Interested in this property?</h3>
                  
                  <div className="space-y-3">
                    <Dialog open={inquiryOpen} onOpenChange={setInquiryOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full btn-primary">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact Builder
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-popover">
                        <DialogHeader>
                          <DialogTitle>Submit Inquiry</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleInquirySubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" required />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" required />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" type="tel" required />
                          </div>
                          <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" name="message" rows={3} required />
                          </div>
                          <Button type="submit" className="w-full btn-primary">
                            Submit Inquiry
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={siteVisitOpen} onOpenChange={setSiteVisitOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Site Visit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-popover">
                        <DialogHeader>
                          <DialogTitle>Schedule Site Visit</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSiteVisitSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="visit-name">Name</Label>
                            <Input id="visit-name" name="name" required />
                          </div>
                          <div>
                            <Label htmlFor="visit-email">Email</Label>
                            <Input id="visit-email" name="email" type="email" required />
                          </div>
                          <div>
                            <Label htmlFor="visit-phone">Phone</Label>
                            <Input id="visit-phone" name="phone" type="tel" required />
                          </div>
                          <div>
                            <Label htmlFor="date">Preferred Date</Label>
                            <Input id="date" name="date" type="date" required />
                          </div>
                          <div>
                            <Label htmlFor="time">Preferred Time</Label>
                            <Input id="time" name="time" type="time" required />
                          </div>
                          <div>
                            <Label htmlFor="group_size">Group Size</Label>
                            <Input id="group_size" name="group_size" type="number" min="1" defaultValue="1" />
                          </div>
                          <Button type="submit" className="w-full btn-primary">
                            Schedule Visit
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="text-sm text-muted-foreground mb-2">Builder Information</div>
                    <div className="font-semibold">{property.builder_name}</div>
                  </div>
                </div>

                {property.investment_score && (
                  <div className="p-6 bg-secondary/10 border border-secondary/20 rounded-xl">
                    <div className="text-sm text-muted-foreground mb-1">Investment Score</div>
                    <div className="text-3xl font-bold text-secondary">{property.investment_score.toFixed(1)}/10</div>
                    <p className="text-sm text-muted-foreground mt-2">High investment potential</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
