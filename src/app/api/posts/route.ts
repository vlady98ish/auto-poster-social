import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Platform } from "@prisma/client";

// GET /api/posts - List all posts for the current user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        jobs: {
          select: {
            id: true,
            platform: true,
            status: true,
            errorMessage: true,
            completedAt: true,
          },
        },
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { videoKey, videoFilename, caption, platforms } = body;

    // Validate required fields
    if (!videoKey || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: videoKey and platforms" },
        { status: 400 }
      );
    }

    // Validate platforms
    const validPlatforms = ["INSTAGRAM", "TIKTOK", "YOUTUBE"];
    const invalidPlatforms = platforms.filter(
      (p: string) => !validPlatforms.includes(p)
    );
    if (invalidPlatforms.length > 0) {
      return NextResponse.json(
        { error: `Invalid platforms: ${invalidPlatforms.join(", ")}` },
        { status: 400 }
      );
    }

    // Create the post with jobs for each platform
    const post = await prisma.post.create({
      data: {
        userId: session.user.id,
        videoKey,
        videoFilename: videoFilename || videoKey.split("/").pop(),
        caption: caption || null,
        platforms: platforms as Platform[],
        status: "DRAFT",
        jobs: {
          create: platforms.map((platform: Platform) => ({
            platform,
            status: "PENDING",
          })),
        },
      },
      include: {
        jobs: true,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
