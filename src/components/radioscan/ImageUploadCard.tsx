'use client';

import React, { useState, useCallback, ChangeEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UploadCloud, XCircle } from 'lucide-react';
import { LoadingIndicator } from './LoadingIndicator';

interface ImageUploadCardProps {
  isLoading: boolean;
  onDiagnose: (file: File) => Promise<void>;
  imagePreview: string | null;
  setImagePreview: (preview: string | null) => void;
  setSelectedFile: (file: File | null) => void;
  selectedFile: File | null;
}

export function ImageUploadCard({
  isLoading,
  onDiagnose,
  imagePreview,
  setImagePreview,
  setSelectedFile,
  selectedFile,
}: ImageUploadCardProps) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    // Also clear input field value if possible, though this is tricky with controlled file inputs
    // For simplicity, users might need to click the input again if they want to re-select the same named file.
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedFile && !isLoading) {
      await onDiagnose(selectedFile);
    }
  };

  return (
    <Card className="w-full shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary flex items-center">
          <UploadCloud className="mr-2 h-6 w-6" />
          Upload Medical Image
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Input
              id="image-upload"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              disabled={isLoading}
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              aria-label="Upload medical image"
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: PNG, JPG, WEBP.
            </p>
          </div>

          {imagePreview && (
            <div className="mt-4 p-4 border border-dashed border-border rounded-lg relative aspect-video max-h-[300px] overflow-hidden group">
              <Image
                src={imagePreview}
                alt="Selected image preview"
                layout="fill"
                objectFit="contain"
                className="rounded-md"
                data-ai-hint="medical scan"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-card/70 hover:bg-card text-destructive-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                onClick={handleRemoveImage}
                disabled={isLoading}
                aria-label="Remove image"
              >
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={!selectedFile || isLoading}
            aria-live="polite"
          >
            {isLoading ? (
              <>
                <LoadingIndicator size={16} className="mr-2 !text-accent-foreground" />
                Diagnosing...
              </>
            ) : (
              'Generate Diagnosis'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
