import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";
import { s3Client, BUCKET } from "./index";

/**
 * Initialize the storage bucket if it doesn't exist
 * Call this during app startup or in a setup script
 */
export async function initializeBucket(): Promise<void> {
  try {
    // Check if bucket exists
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET }));
    console.log(`Bucket '${BUCKET}' already exists`);
  } catch (error: unknown) {
    // Bucket doesn't exist, create it
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      (error.name === "NotFound" || error.name === "NoSuchBucket")
    ) {
      console.log(`Creating bucket '${BUCKET}'...`);

      await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET }));

      // Set bucket policy to allow public read for video thumbnails (optional)
      // For now, we'll keep it private and use presigned URLs
      const policy = {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${BUCKET}/public/*`],
          },
        ],
      };

      await s3Client.send(
        new PutBucketPolicyCommand({
          Bucket: BUCKET,
          Policy: JSON.stringify(policy),
        })
      );

      console.log(`Bucket '${BUCKET}' created successfully`);
    } else {
      throw error;
    }
  }
}
