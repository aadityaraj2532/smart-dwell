import { Link } from "react-router-dom";
import { Bed, Bath, Maximize2, MapPin, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Property, formatPrice, formatArea } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

interface PropertyCardProps {
  property: Property;
  onCompare?: (property: Property) => void;
  showCompareButton?: boolean;
}

const PropertyCard = ({ property, onCompare, showCompareButton = false }: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onCompare) {
      onCompare(property);
      toast.success("Added to comparison");
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      <Link to={`/property/${property.id || property.property_id}`}>
        <div className="relative h-56 overflow-hidden">
          <img
            src={property.image_urls?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={handleFavorite}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all z-10"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>
          {property.investment_score && property.investment_score > 8 && (
            <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
              FEATURED
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-6">
        <Link to={`/property/${property.id || property.property_id}`}>
          <div className="space-y-3">
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 hover:text-primary transition-colors">
              {property.name}
            </h3>

            {/* Location */}
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm line-clamp-1">
                {property.area || property.geo_location_details?.locality || 'Location not specified'}, {property.city || property.geo_location_details?.city || 'City not specified'}
              </span>
            </div>

            {/* Property Details */}
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {property.bedrooms} Beds | {property.bathrooms} Baths | {formatArea(property.area_sqft)}
            </p>

            {/* Price */}
            <p className="text-lg font-bold text-primary mt-4">
              {formatPrice(property.price, property.currency)}
            </p>
          </div>
        </Link>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-2">
        <Link to={`/property/${property.id || property.property_id}`} className="flex-1">
          <Button className="w-full h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-colors">
            View Details
          </Button>
        </Link>
        {showCompareButton && (
          <Button variant="outline" onClick={handleCompare} className="border-gray-300 dark:border-gray-600">
            Compare
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
