"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, Clock, MapPin, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { OutbreakData } from "@/types/types";

interface CriticalAlertsProps {
  outbreaks?: OutbreakData[];
  isLoading: boolean;
  searchQuery: string;
}

export default function CriticalAlerts({
  outbreaks,
  isLoading,
  searchQuery,
}: CriticalAlertsProps) {
  const filteredOutbreaks =
    outbreaks?.filter(
      (outbreak) =>
        outbreak.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        outbreak.Overview.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const getPriorityLevel = (outbreak: OutbreakData) => {
    const title = outbreak.Title.toLowerCase();
    const overview = outbreak.Overview.toLowerCase();

    if (
      title.includes("death") ||
      title.includes("fatal") ||
      overview.includes("died")
    ) {
      return "HIGH";
    } else if (title.includes("outbreak") || title.includes("cases")) {
      return "MEDIUM";
    }
    return "LOW";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-50 border-red-200";
      case "MEDIUM":
        return "bg-yellow-50 border-yellow-200";
      case "LOW":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const extractLocation = (overview: string) => {
    const locations = [
      "Egypt",
      "UAE",
      "Saudi Arabia",
      "Kuwait",
      "Qatar",
      "Oman",
      "Bahrain",
      "Iran",
      "Iraq",
      "Jordan",
      "Lebanon",
      "Syria",
      "Yemen",
      "Israel",
      "Palestine",
    ];
    for (const location of locations) {
      if (overview.includes(location)) {
        return location;
      }
    }
    return "Middle East";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <CardTitle>Critical Health Alerts</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <CardTitle>Critical Health Alerts</CardTitle>
        </div>
        <p className="text-sm text-gray-600">
          Real-time health intelligence from verified sources
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {filteredOutbreaks.slice(0, 6).map((outbreak) => {
            const priority = getPriorityLevel(outbreak);
            const location = extractLocation(outbreak.Overview);

            return (
              <Card key={outbreak.Id} className={getPriorityColor(priority)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge
                      variant="secondary"
                      className={getPriorityBadgeColor(priority)}
                    >
                      {priority === "HIGH" && (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      )}
                      {priority === "MEDIUM" && (
                        <Info className="w-3 h-3 mr-1" />
                      )}
                      {priority === "LOW" && <Info className="w-3 h-3 mr-1" />}
                      {priority} PRIORITY
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-base leading-tight">
                    {outbreak.Title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {outbreak.Overview.replace(/<[^>]*>/g, "").substring(
                      0,
                      150
                    )}
                    ...
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {formatDistanceToNow(
                          new Date(outbreak.PublicationDate),
                          { addSuffix: true }
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">WHO EMRO</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
