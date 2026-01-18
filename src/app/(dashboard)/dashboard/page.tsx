import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileVideo, Link2, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400">
          Manage your social media posts and connections
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Posts
            </CardTitle>
            <FileVideo className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-zinc-500">No posts yet</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Scheduled
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-zinc-500">Ready to publish</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Published
            </CardTitle>
            <FileVideo className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-zinc-500">Successfully posted</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Connections
            </CardTitle>
            <Link2 className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-zinc-500">Linked accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Main CTA */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 rounded-full bg-zinc-800 p-4">
            <Upload className="h-8 w-8 text-zinc-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-white">
            Upload your first video
          </h3>
          <p className="mb-6 text-center text-sm text-zinc-400">
            Upload a Reel or Short and publish it to multiple platforms at once
          </p>
          <Link href="/dashboard/upload">
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Video
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Platform Status */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-white">Connected Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-zinc-800 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-purple-500">
                  <span className="text-lg">📸</span>
                </div>
                <div>
                  <p className="font-medium text-white">Instagram</p>
                  <p className="text-xs text-zinc-500">Not connected</p>
                </div>
              </div>
              <Badge variant="outline" className="text-zinc-500">
                Coming soon
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-zinc-800 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-600">
                  <span className="text-lg">🎵</span>
                </div>
                <div>
                  <p className="font-medium text-white">TikTok</p>
                  <p className="text-xs text-zinc-500">Not connected</p>
                </div>
              </div>
              <Badge variant="outline" className="text-zinc-500">
                Coming soon
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-zinc-800 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-red-600">
                  <span className="text-lg">▶️</span>
                </div>
                <div>
                  <p className="font-medium text-white">YouTube Shorts</p>
                  <p className="text-xs text-zinc-500">Not connected</p>
                </div>
              </div>
              <Badge variant="outline" className="text-zinc-500">
                Coming soon
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
