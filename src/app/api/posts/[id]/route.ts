import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteFile } from "@/lib/storage";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/posts/[id] - Get a single post
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const post = await prisma.post.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        jobs: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PATCH /api/posts/[id] - Update a post
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { caption, scheduledFor } = body;

    // Check ownership
    const existing = await prisma.post.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Only allow editing drafts and scheduled posts
    if (!["DRAFT", "SCHEDULED"].includes(existing.status)) {
      return NextResponse.json(
        { error: "Cannot edit a published or processing post" },
        { status: 400 }
      );
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(caption !== undefined && { caption }),
        ...(scheduledFor !== undefined && {
          scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
          status: scheduledFor ? "SCHEDULED" : "DRAFT",
        }),
      },
      include: {
        jobs: true,
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check ownership
    const post = await prisma.post.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Don't allow deleting published posts
    if (post.status === "PUBLISHED") {
      return NextResponse.json(
        { error: "Cannot delete a published post" },
        { status: 400 }
      );
    }

    // Delete associated jobs first (cascade should handle it, but explicit is safer)
    await prisma.job.deleteMany({
      where: { postId: id },
    });

    // Delete the post
    await prisma.post.delete({
      where: { id },
    });

    // Try to delete the video from storage (don't fail if it doesn't work)
    try {
      await deleteFile(post.videoKey);
    } catch (e) {
      console.warn("Failed to delete video from storage:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
