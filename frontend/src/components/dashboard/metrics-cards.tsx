"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Globe,
  Database,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { OutbreakData } from "@/types/types";

interface MetricsCardsProps {
  outbreaks?: OutbreakData[];
  isLoading: boolean;
}

export default function MetricsCards({
  outbreaks,
  isLoading,
}: MetricsCardsProps) {
  const activeMonitoring = outbreaks?.length || 0;
  const regionalCoverage = 8; // Middle East countries
  const dataSources = 24; // Verified health organizations
  const responseTime = "2.3min";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Active Monitoring */}
      <Card className="bg-red-50 border-red-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            Active Monitoring
          </CardTitle>
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {isLoading ? "..." : activeMonitoring}
          </div>
          <p className="text-xs text-gray-600 mt-1">Health events tracked</p>
          <Badge
            variant="secondary"
            className="mt-2 bg-green-100 text-green-800"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            +12%
          </Badge>
        </CardContent>
      </Card>

      {/* Regional Coverage */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            Regional Coverage
          </CardTitle>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {regionalCoverage}
          </div>
          <p className="text-xs text-gray-600 mt-1">Middle East countries</p>
          <Badge
            variant="secondary"
            className="mt-2 bg-green-100 text-green-800"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            100%
          </Badge>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            Data Sources
          </CardTitle>
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Database className="w-4 h-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{dataSources}</div>
          <p className="text-xs text-gray-600 mt-1">
            Verified health organizations
          </p>
          <Badge
            variant="secondary"
            className="mt-2 bg-green-100 text-green-800"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            +3
          </Badge>
        </CardContent>
      </Card>

      {/* Response Time */}
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            Response Time
          </CardTitle>
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{responseTime}</div>
          <p className="text-xs text-gray-600 mt-1">Average alert processing</p>
          <Badge variant="secondary" className="mt-2 bg-red-100 text-red-800">
            <TrendingDown className="w-3 h-3 mr-1" />
            -15%
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
