import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, MapPin, Building, BarChart3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { toast } from "sonner";

const MarketInsights = () => {
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("Pune");
  const [propertyType, setPropertyType] = useState("flat");
  const [insights, setInsights] = useState<any>(null);

  const handleGetInsights = async () => {
    setLoading(true);
    try {
      const data = await api.getMarketInsights({
        city,
        property_type: propertyType,
      });
      setInsights(data);
      toast.success("Market insights loaded successfully");
    } catch (error) {
      console.error("Error fetching insights:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to fetch market insights: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const mockStats = [
    {
      icon: DollarSign,
      title: "Average Price/sq ft",
      value: "₹5,238",
      change: "+5.2%",
      trend: "up" as const,
    },
    {
      icon: TrendingUp,
      title: "Price Growth",
      value: "8.5%",
      change: "YoY",
      trend: "up" as const,
    },
    {
      icon: Building,
      title: "Total Listings",
      value: "1,250",
      change: "+120 this month",
      trend: "up" as const,
    },
    {
      icon: BarChart3,
      title: "Avg. Days on Market",
      value: "45 days",
      change: "-5 days",
      trend: "down" as const,
    },
  ];

  const hotAreas = [
    { name: "Kharadi", growth: "+12%", avgPrice: "₹5,400/sq ft", demand: "High" },
    { name: "Hinjewadi", growth: "+10%", avgPrice: "₹5,100/sq ft", demand: "Very High" },
    { name: "Baner", growth: "+8%", avgPrice: "₹6,200/sq ft", demand: "High" },
    { name: "Wakad", growth: "+7%", avgPrice: "₹4,800/sq ft", demand: "Medium" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Market Insights</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            AI-powered real estate market analysis and trends
          </p>

          {/* Filters Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px] space-y-2">
                <label className="text-sm font-bold text-gray-900 dark:text-white">City</label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="bg-background-light dark:bg-slate-900 border-gray-300 dark:border-gray-600 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900">
                    <SelectItem value="Pune">Pune</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[200px] space-y-2">
                <label className="text-sm font-bold text-gray-900 dark:text-white">Property Type</label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="bg-background-light dark:bg-slate-900 border-gray-300 dark:border-gray-600 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900">
                    <SelectItem value="flat">Flat / Apartment</SelectItem>
                    <SelectItem value="villa">Villa / House</SelectItem>
                    <SelectItem value="plot">Plot / Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="h-11 px-8 bg-primary text-white font-bold shadow-md hover:shadow-lg transition-all hover:scale-105" 
                onClick={handleGetInsights} 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Get Insights
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {mockStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div
                      className={`flex items-center text-sm font-bold ${
                        stat.trend === "up" ? "text-green-500" : "text-primary"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hot Areas */}
          <Card className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="flex items-center text-gray-900 dark:text-white text-xl">
                <MapPin className="h-6 w-6 mr-2 text-primary" />
                Hot Investment Areas in {city}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Top performing localities by growth and demand</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {hotAreas.map((area, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-750 rounded-xl hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-lg">
                        {index + 1}
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                          {area.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          Avg: {area.avgPrice}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="flex items-center justify-end space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-green-500 font-bold text-lg">{area.growth}</span>
                      </div>
                      <div className="text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                            area.demand === "Very High"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : area.demand === "High"
                              ? "bg-primary/20 text-primary dark:bg-primary/30"
                              : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {area.demand} Demand
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl">
                <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                  💡 <span className="font-semibold">Pro Tip:</span> Areas with "Very High" demand typically offer better rental yields
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Investment Analysis */}
          <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="flex items-center text-gray-900 dark:text-white text-xl">
                <TrendingUp className="h-6 w-6 mr-2 text-green-500" />
                Investment Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Appreciation Potential</span>
                  <span className="font-bold text-green-500 text-lg">High</span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full w-4/5 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Rental Yield</span>
                  <span className="font-bold text-primary text-lg">6.5%</span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full w-3/4 bg-gradient-to-r from-primary to-blue-600 rounded-full transition-all duration-500" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Risk Level</span>
                  <span className="font-bold text-amber-500 text-lg">Low-Medium</span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full w-2/5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500" />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700 text-center bg-gradient-to-br from-primary/10 to-green-500/10 dark:from-primary/20 dark:to-green-500/20 rounded-xl p-6">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Overall Investment Score</div>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">8.2</div>
                <div className="text-xl font-bold text-gray-600 dark:text-gray-400">/10</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Excellent Investment Opportunity</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        {insights && (
          <Card className="mt-8 bg-gradient-to-br from-white to-primary/5 dark:from-gray-800 dark:to-primary/10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardTitle className="flex items-center text-gray-900 dark:text-white text-2xl">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary mr-3">
                  <BarChart3 className="h-6 w-6" />
                </div>
                AI-Powered Market Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="p-6 bg-primary/10 border-2 border-primary/30 rounded-xl shadow-sm">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{insights.market_insights}</p>
                </div>
                {insights.recommendations && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center">
                      <div className="h-1 w-1 rounded-full bg-primary mr-2"></div>
                      Key Recommendations
                    </h4>
                    <ul className="space-y-3">
                      {insights.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/20 text-primary mt-0.5 flex-shrink-0">
                            <span className="text-xs font-bold">{index + 1}</span>
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MarketInsights;
