"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VideoUploader } from "@/components/upload/video-uploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Instagram, Music2, Loader2 } from "lucide-react";

interface UploadedVideo {
  key: string;
  filename: string;
  size: number;
}

const PLATFORMS = [
  { id: "INSTAGRAM", name: "Instagram Reels", icon: Instagram, color: "text-pink-500" },
  { id: "TIKTOK", name: "TikTok", icon: Music2, color: "text-cyan-400" },
] as const;

export default function UploadPage() {
  const router = useRouter();
  const [video, setVideo] = useState<UploadedVideo | null>(null);
  const [caption, setCaption] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleUploadComplete = (uploadedVideo: UploadedVideo) => {
    setVideo(uploadedVideo);
    toast.success("Video uploaded successfully! Original quality preserved.");
  };

  const handleUploadError = (error: string) => {
    toast.error(error);
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleCreatePost = async () => {
    if (!video || selectedPlatforms.length === 0) {
      toast.error("Please upload a video and select at least one platform");
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoKey: video.key,
          videoFilename: video.filename,
          caption: caption || null,
          platforms: selectedPlatforms,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create post");
      }

      toast.success("Post created as draft!");
      router.push("/dashboard/posts");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create post");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Upload Video</h1>
        <p className="text-zinc-400">
          Upload a Reel or Short to publish across platforms
        </p>
      </div>

      <div className="space-y-6">
        {/* Video Upload */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-white">Video</CardTitle>
          </CardHeader>
          <CardContent>
            <VideoUploader
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
            />
          </CardContent>
        </Card>

        {/* Caption - only show after video upload */}
        {video && (
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-white">Caption</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="caption" className="text-zinc-400">
                  Add a caption for your post (optional)
                </Label>
                <Input
                  id="caption"
                  placeholder="Write something amazing..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500"
                />
                <p className="text-xs text-zinc-500">
                  {caption.length}/2200 characters
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Platform Selection - only show after video upload */}
        {video && (
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-white">Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-zinc-400">
                  Select where you want to publish this video
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {PLATFORMS.map((platform) => {
                    const Icon = platform.icon;
                    const isSelected = selectedPlatforms.includes(platform.id);
                    return (
                      <div
                        key={platform.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                          isSelected
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600"
                        }`}
                        onClick={() => togglePlatform(platform.id)}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => togglePlatform(platform.id)}
                          className="border-zinc-600"
                        />
                        <Icon className={`h-5 w-5 ${platform.color}`} />
                        <span className="font-medium text-white">
                          {platform.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create Post Button */}
        {video && (
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setVideo(null);
                setCaption("");
                setSelectedPlatforms([]);
              }}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Reset
            </Button>
            <Button
              onClick={handleCreatePost}
              disabled={selectedPlatforms.length === 0 || isCreating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Save as Draft"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
