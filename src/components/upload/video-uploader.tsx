"use client";

import { useState, useCallback } from "react";
import { Upload, X, Video, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface UploadedVideo {
  key: string;
  filename: string;
  size: number;
}

interface VideoUploaderProps {
  onUploadComplete: (video: UploadedVideo) => void;
  onUploadError?: (error: string) => void;
}

type UploadState = "idle" | "uploading" | "success" | "error";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

export function VideoUploader({ onUploadComplete, onUploadError }: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Invalid file type. Please upload MP4, MOV, or WebM videos.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File too large. Maximum size is 500MB.";
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    setUploadState("uploading");
    setProgress(0);
    setErrorMessage(null);

    try {
      // Step 1: Get presigned URL from our API
      const presignedRes = await fetch("/api/upload/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type, // Original content type preserved
          size: file.size,
        }),
      });

      if (!presignedRes.ok) {
        const error = await presignedRes.json();
        throw new Error(error.error || "Failed to get upload URL");
      }

      const { uploadUrl, key } = await presignedRes.json();

      // Step 2: Upload directly to MinIO using XHR for progress tracking
      // NO CONVERSION - raw bytes go directly to storage
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setProgress(percent);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error("Upload failed"));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Upload failed")));

        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file); // Raw file, no transformation
      });

      setUploadState("success");
      onUploadComplete({
        key,
        filename: file.name,
        size: file.size,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      setUploadState("error");
      setErrorMessage(message);
      onUploadError?.(message);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (!file) return;

      const error = validateFile(file);
      if (error) {
        setErrorMessage(error);
        setUploadState("error");
        return;
      }

      setSelectedFile(file);
      uploadFile(file);
    },
    []
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setErrorMessage(error);
      setUploadState("error");
      return;
    }

    setSelectedFile(file);
    uploadFile(file);
  };

  const resetUpload = () => {
    setUploadState("idle");
    setProgress(0);
    setSelectedFile(null);
    setErrorMessage(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full">
      {uploadState === "idle" && (
        <div
          className={cn(
            "relative rounded-lg border-2 border-dashed p-8 transition-colors",
            isDragging
              ? "border-purple-500 bg-purple-500/10"
              : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-600"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            onChange={handleFileSelect}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-zinc-800 p-4">
              <Upload className="h-8 w-8 text-zinc-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-white">
                Drop your video here
              </p>
              <p className="text-sm text-zinc-400">
                or click to browse
              </p>
            </div>
            <p className="text-xs text-zinc-500">
              MP4, MOV, or WebM • Max 500MB • Original quality preserved
            </p>
          </div>
        </div>
      )}

      {uploadState === "uploading" && selectedFile && (
        <div className="rounded-lg border border-zinc-700 bg-zinc-900/50 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-zinc-800 p-3">
              <Video className="h-6 w-6 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-white">
                {selectedFile.name}
              </p>
              <p className="text-sm text-zinc-400">
                {formatSize(selectedFile.size)}
              </p>
              <div className="mt-3">
                <Progress value={progress} className="h-2" />
                <p className="mt-1 text-xs text-zinc-500">
                  Uploading... {progress}%
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetUpload}
              className="text-zinc-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {uploadState === "success" && selectedFile && (
        <div className="rounded-lg border border-green-800 bg-green-900/20 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-green-800/50 p-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-white">
                {selectedFile.name}
              </p>
              <p className="text-sm text-green-400">
                Upload complete • Original quality preserved
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetUpload}
              className="text-zinc-400 hover:text-white"
            >
              Upload another
            </Button>
          </div>
        </div>
      )}

      {uploadState === "error" && (
        <div className="rounded-lg border border-red-800 bg-red-900/20 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-red-800/50 p-3">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-white">Upload failed</p>
              <p className="text-sm text-red-400">
                {errorMessage || "Something went wrong"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetUpload}
              className="text-zinc-400 hover:text-white"
            >
              Try again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
