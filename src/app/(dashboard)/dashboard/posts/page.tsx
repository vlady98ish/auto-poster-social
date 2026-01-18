"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Instagram,
  Music2,
  Video,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
} from "lucide-react";

interface Job {
  id: string;
  platform: "INSTAGRAM" | "TIKTOK" | "YOUTUBE";
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  errorMessage: string | null;
}

interface Post {
  id: string;
  videoFilename: string | null;
  caption: string | null;
  platforms: ("INSTAGRAM" | "TIKTOK" | "YOUTUBE")[];
  status: "DRAFT" | "SCHEDULED" | "PUBLISHING" | "PUBLISHED" | "PARTIAL" | "FAILED";
  scheduledFor: string | null;
  createdAt: string;
  jobs: Job[];
}

const PLATFORM_ICONS = {
  INSTAGRAM: Instagram,
  TIKTOK: Music2,
  YOUTUBE: Video,
};

const PLATFORM_COLORS = {
  INSTAGRAM: "text-pink-500",
  TIKTOK: "text-cyan-400",
  YOUTUBE: "text-red-500",
};

const STATUS_CONFIG = {
  DRAFT: { label: "Draft", color: "bg-zinc-600", icon: Clock },
  SCHEDULED: { label: "Scheduled", color: "bg-blue-600", icon: Clock },
  PUBLISHING: { label: "Publishing", color: "bg-yellow-600", icon: Loader2 },
  PUBLISHED: { label: "Published", color: "bg-green-600", icon: CheckCircle },
  PARTIAL: { label: "Partial", color: "bg-orange-600", icon: AlertCircle },
  FAILED: { label: "Failed", color: "bg-red-600", icon: AlertCircle },
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      toast.error("Failed to load posts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setDeletingId(postId);
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete post");
      }

      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success("Post deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Posts</h1>
          <p className="text-zinc-400">
            View and manage all your scheduled and published posts
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Video className="h-12 w-12 text-zinc-600" />
            <p className="mt-4 text-zinc-400">No posts yet</p>
            <Link href="/dashboard/upload" className="mt-4">
              <Button variant="outline" className="border-zinc-700">
                Upload your first video
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const StatusIcon = STATUS_CONFIG[post.status].icon;
            return (
              <Card
                key={post.id}
                className="border-zinc-800 bg-zinc-900/50 transition-colors hover:border-zinc-700"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Video info */}
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-zinc-800 p-3">
                        <Video className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {post.videoFilename || "Untitled video"}
                        </p>
                        {post.caption && (
                          <p className="mt-1 text-sm text-zinc-400 line-clamp-1">
                            {post.caption}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-3">
                          {/* Platforms */}
                          <div className="flex items-center gap-1">
                            {post.platforms.map((platform) => {
                              const Icon = PLATFORM_ICONS[platform];
                              return (
                                <Icon
                                  key={platform}
                                  className={`h-4 w-4 ${PLATFORM_COLORS[platform]}`}
                                />
                              );
                            })}
                          </div>
                          {/* Date */}
                          <span className="text-xs text-zinc-500">
                            {formatDate(post.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Status & Actions */}
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`${STATUS_CONFIG[post.status].color} text-white`}
                      >
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {STATUS_CONFIG[post.status].label}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id || post.status === "PUBLISHED"}
                        className="text-zinc-400 hover:text-red-400"
                      >
                        {deletingId === post.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
