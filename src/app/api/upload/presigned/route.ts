import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPresignedUploadUrl, generateVideoKey } from "@/lib/storage";

// Allowed video MIME types
const ALLOWED_TYPES = [
  "video/mp4",
  "video/quicktime", // .mov
  "video/webm",
];

// Max file size: 500MB
const MAX_FILE_SIZE = 500 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { filename, contentType, size } = body;

    // Validate content type
    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Allowed: MP4, MOV, WebM",
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "File too large. Maximum size: 500MB",
        },
        { status: 400 }
      );
    }

    // Generate unique key for this video
    const key = generateVideoKey(session.user.id, filename);

    // Get presigned upload URL
    const uploadUrl = await getPresignedUploadUrl(key, contentType);

    return NextResponse.json({
      uploadUrl,
      key,
      expiresIn: 3600, // 1 hour
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
