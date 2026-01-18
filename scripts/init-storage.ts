/**
 * Initialize MinIO bucket
 * Run with: npx tsx scripts/init-storage.ts
 */

import { S3Client, CreateBucketCommand, HeadBucketCommand, ListBucketsCommand } from "@aws-sdk/client-s3";

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || "http://localhost:9000";
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || "minioadmin";
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || "minioadmin";
const BUCKET = process.env.MINIO_BUCKET || "videos";

const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: MINIO_ENDPOINT,
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

async function main() {
  console.log("🔌 Connecting to MinIO at", MINIO_ENDPOINT);

  // List existing buckets
  const { Buckets } = await s3Client.send(new ListBucketsCommand({}));
  console.log("📦 Existing buckets:", Buckets?.map(b => b.Name).join(", ") || "none");

  // Check if our bucket exists
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET }));
    console.log(`✅ Bucket '${BUCKET}' already exists`);
  } catch (error: unknown) {
    if (error && typeof error === "object" && "name" in error &&
        (error.name === "NotFound" || error.name === "NoSuchBucket")) {
      console.log(`📦 Creating bucket '${BUCKET}'...`);
      await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET }));
      console.log(`✅ Bucket '${BUCKET}' created successfully`);
    } else {
      throw error;
    }
  }

  console.log("\n🎉 MinIO storage is ready!");
}

main().catch(console.error);
