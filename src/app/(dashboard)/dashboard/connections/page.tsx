import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ConnectionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Connections</h1>
        <p className="text-zinc-400">
          Connect your social media accounts to start posting
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* TikTok */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-600">
                <span className="text-2xl">🎵</span>
              </div>
              <div>
                <CardTitle className="text-white">TikTok</CardTitle>
                <Badge variant="outline" className="mt-1 text-zinc-500">
                  Not connected
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-zinc-400">
              Connect your TikTok account to publish videos directly.
            </p>
            <Button className="w-full" disabled>
              Connect TikTok (Coming soon)
            </Button>
          </CardContent>
        </Card>

        {/* Instagram */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-purple-500">
                <span className="text-2xl">📸</span>
              </div>
              <div>
                <CardTitle className="text-white">Instagram</CardTitle>
                <Badge variant="outline" className="mt-1 text-zinc-500">
                  Not connected
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-zinc-400">
              Connect your Instagram Business account for Reels.
            </p>
            <Button className="w-full" disabled>
              Connect Instagram (Coming soon)
            </Button>
          </CardContent>
        </Card>

        {/* YouTube */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-red-600">
                <span className="text-2xl">▶️</span>
              </div>
              <div>
                <CardTitle className="text-white">YouTube</CardTitle>
                <Badge variant="outline" className="mt-1 text-zinc-500">
                  Not connected
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-zinc-400">
              Connect your YouTube channel to publish Shorts.
            </p>
            <Button className="w-full" disabled>
              Connect YouTube (Coming soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
