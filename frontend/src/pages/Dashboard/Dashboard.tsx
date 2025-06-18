"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Filter,
  BarChart3,
  Globe,
  Bell,
  User,
  LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { fetchMiddleEastOutbreaks } from "@/lib/api";
import MetricsCards from "@/components/dashboard/metrics-cards";
import CriticalAlerts from "@/components/dashboard/critical-alerts";
import RealTimeFeed from "@/components/dashboard/real-time-feed";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const { user, logout } = useAuth();

  const {
    data: outbreaks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["middle-east-outbreaks"],
    queryFn: fetchMiddleEastOutbreaks,
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-40 border-b border-gray-200 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Health Intelligence Guardian
                </h1>
                <p className="text-sm text-gray-500">
                  Middle East Health Monitoring Platform
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Live Feed Active
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <BarChart3 className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              AI Reports
            </Button>
            <Button variant="outline" size="sm">
              us EN
            </Button>
            <Button variant="outline" size="sm">
              <Globe className="w-4 h-4 mr-2" />
              AI Assistant
            </Button>
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className=" px-40 py-4  border-gray-200">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search health intelligence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Export Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" px-40 py-6">
        {/* Metrics Cards */}
        <MetricsCards outbreaks={outbreaks} isLoading={isLoading} />

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="geographic">Geographic</TabsTrigger>
            <TabsTrigger value="disease-tracking">Disease Tracking</TabsTrigger>
            <TabsTrigger value="risk-assessment">Risk Assessment</TabsTrigger>
            <TabsTrigger value="ai-features">AI Features</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              {/* Critical Health Alerts */}
              <CriticalAlerts
                outbreaks={outbreaks}
                isLoading={isLoading}
                searchQuery={searchQuery}
              />

              {/* Real-time Intelligence Feed */}
              <RealTimeFeed outbreaks={outbreaks} isLoading={isLoading} />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>Detailed analytics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Analytics features coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geographic" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Regional outbreak mapping</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Geographic visualization coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disease-tracking" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Disease Tracking</CardTitle>
                <CardDescription>
                  Track specific diseases and outbreaks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Disease tracking features coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk-assessment" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>AI-powered risk analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Risk assessment tools coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-features" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Features</CardTitle>
                <CardDescription>
                  Advanced AI-powered health intelligence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">AI features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
