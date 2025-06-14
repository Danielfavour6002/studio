'use client';

import React, { useState, useEffect } from 'react';
import { AppHeader } from '@/components/radioscan/AppHeader';
import { ImageUploadCard } from '@/components/radioscan/ImageUploadCard';
import { ResultsDisplay } from '@/components/radioscan/ResultsDisplay';
import { performDiagnosisAction, type AnalysisResult } from './actions';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

export default function RadioscanPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Effect to clear results when a new file is selected or file is cleared
  useEffect(() => {
    if (selectedFile === null) { // If file is cleared
        setAnalysisResult(null);
        setError(null);
    }
    // For new file selection, results are cleared before new diagnosis starts
  }, [selectedFile]);


  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDiagnose = async (file: File) => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null); // Clear previous results before starting new diagnosis

    try {
      const imageDataUri = await fileToDataUri(file);
      const result = await performDiagnosisAction(imageDataUri);

      if (result.error) {
        setError(result.error);
        toast({
          title: "Diagnosis Error",
          description: result.error,
          variant: "destructive",
        });
      } else if (result.data) {
        setAnalysisResult(result.data);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setError(errorMessage);
      toast({
        title: "Processing Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-8">
          <ImageUploadCard
            isLoading={isLoading}
            onDiagnose={handleDiagnose}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />

          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {(isLoading || analysisResult) && (
            <ResultsDisplay
              isLoading={isLoading}
              analysisResult={analysisResult}
              imagePreview={imagePreview} 
            />
          )}
        </div>
      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Radioscan. For informational purposes only.</p>
      </footer>
    </div>
  );
}
