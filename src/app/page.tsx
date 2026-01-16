import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 p-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/80">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-5xl">🎬</div>
          <CardTitle className="text-3xl font-bold text-white">
            Auto-Poster
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Автоматическая публикация Reels и Shorts в социальные сети
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-wrap justify-center gap-2">
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              Instagram
            </Badge>
            <Badge className="bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700">
              TikTok
            </Badge>
            <Badge className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
              YouTube
            </Badge>
          </div>

          <div className="space-y-3">
            <Button className="w-full" size="lg">
              Get Started
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              Learn More
            </Button>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 text-center">
            <p className="text-sm text-zinc-500">
              ✓ Step 1 — Project Scaffolding
            </p>
            <p className="text-sm text-green-500">
              ✓ Step 2 — shadcn/ui Setup
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
