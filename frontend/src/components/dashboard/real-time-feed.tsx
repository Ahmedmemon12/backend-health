"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, ExternalLink } from "lucide-react"
import type { OutbreakData } from "@/types/types"
import { formatDistanceToNow } from "date-fns"

interface RealTimeFeedProps {
  outbreaks?: OutbreakData[]
  isLoading: boolean
}

export default function RealTimeFeed({ outbreaks, isLoading }: RealTimeFeedProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <CardTitle>Real-time Intelligence Feed</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Live Analytics
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <CardTitle>Real-time Intelligence Feed</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Live Analytics
          </Badge>
        </div>
        <p className="text-sm text-gray-600">AI-powered analysis of Middle East health data streams</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {outbreaks?.slice(0, 5).map((outbreak) => (
            <div
              key={outbreak.Id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    Disease Outbreaks
                  </Badge>
                  <span className="text-xs text-gray-500">WHO EMRO</span>
                </div>
                <h4 className="font-medium text-sm mb-1">{outbreak.Title}</h4>
                <p className="text-xs text-gray-600">
                  {formatDistanceToNow(new Date(outbreak.PublicationDate), { addSuffix: true })}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm text-blue-900">Activate Windows</h4>
              <p className="text-xs text-blue-700">Go to Settings to activate Windows</p>
            </div>
            <Button variant="outline" size="sm" className="text-blue-700 border-blue-300">
              Edit with ❤️ Lovable
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
