'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle2, ClipboardCheck, FileText, Percent } from 'lucide-react';
import type { AnalysisResult } from '@/app/actions';

interface ResultsDisplayProps {
  isLoading: boolean;
  analysisResult: AnalysisResult | null;
  imagePreview: string | null; // The image that was analyzed
}

export function ResultsDisplay({ isLoading, analysisResult, imagePreview }: ResultsDisplayProps) {
  if (isLoading) {
    return (
      <div className="mt-8 w-full space-y-6 animate-pulse" aria-busy="true" aria-live="polite">
        {imagePreview && (
          <Card className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="aspect-video max-h-[400px] relative overflow-hidden rounded-md">
                 <Image src={imagePreview} alt="Uploaded image for analysis" layout="fill" objectFit="contain" className="opacity-50" data-ai-hint="medical scan" />
              </div>
            </CardContent>
          </Card>
        )}
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/4 mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysisResult) {
    return null; // Don't render anything if not loading and no results
  }

  const certaintyPercentage = Math.round(analysisResult.certaintyScore * 100);
  let certaintyColorClass = 'bg-primary'; // Default purple
  if (certaintyPercentage >= 75) certaintyColorClass = 'bg-green-500'; // High certainty
  else if (certaintyPercentage >= 50) certaintyColorClass = 'bg-yellow-500'; // Medium certainty
  else certaintyColorClass = 'bg-red-500'; // Low certainty

  return (
    <div className="mt-8 w-full space-y-6" role="region" aria-labelledby="results-heading">
      <h2 id="results-heading" className="sr-only">Analysis Results</h2>
      
      {imagePreview && (
        <Card className="shadow-lg overflow-hidden transition-all duration-500 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
          <CardHeader>
            <CardTitle className="text-xl font-headline text-primary">Analyzed Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video max-h-[400px] relative overflow-hidden rounded-md border border-border">
              <Image src={imagePreview} alt="Analyzed medical image" layout="fill" objectFit="contain" className="rounded-md" data-ai-hint="medical x-ray" />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg transition-all duration-500 ease-out delay-100 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-primary flex items-center">
            <ClipboardCheck className="mr-2 h-5 w-5" />
            Diagnosis Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{analysisResult.diagnosis}</h3>
            <CardDescription>AI-generated primary diagnosis.</CardDescription>
          </div>
          
          <Separator />

          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-md font-semibold text-foreground flex items-center">
                <Percent className="mr-2 h-4 w-4 text-muted-foreground" />
                Certainty Score
              </h4>
              <span className={`font-bold text-lg ${
                certaintyPercentage >= 75 ? 'text-green-600' : certaintyPercentage >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {certaintyPercentage}%
              </span>
            </div>
            <Progress value={certaintyPercentage} className="h-3" indicatorClassName={certaintyColorClass} aria-label={`Diagnostic certainty: ${certaintyPercentage}%`} />
            <CardDescription className="mt-1 text-xs">
              {certaintyPercentage >= 75 && <CheckCircle2 className="inline mr-1 h-3 w-3 text-green-500" />}
              {certaintyPercentage < 75 && certaintyPercentage >= 50 && <AlertTriangle className="inline mr-1 h-3 w-3 text-yellow-500" />}
              {certaintyPercentage < 50 && <AlertTriangle className="inline mr-1 h-3 w-3 text-red-500" />}
              Confidence level of the AI in this diagnosis.
            </CardDescription>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg transition-all duration-500 ease-out delay-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-primary flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Detailed Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
            {analysisResult.reportText}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
