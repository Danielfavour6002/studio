'use server';

import { generateDiagnosis, type GenerateDiagnosisOutput } from '@/ai/flows/generate-diagnosis';
import { generateReport, type GenerateReportOutput } from '@/ai/flows/generate-report';

export interface AnalysisResult {
  diagnosis: string;
  certaintyScore: number;
  reportText: string;
  imagePreview?: string; 
}

interface DiagnosisActionResult {
  data?: AnalysisResult;
  error?: string;
}

export async function performDiagnosisAction(imageDataUri: string): Promise<DiagnosisActionResult> {
  if (!imageDataUri) {
    return { error: 'Image data is missing.' };
  }

  try {
    // Step 1: Generate Diagnosis
    const diagnosisResult: GenerateDiagnosisOutput = await generateDiagnosis({ imageDataUri });
    if (!diagnosisResult || !diagnosisResult.diagnosis || typeof diagnosisResult.confidence !== 'number') {
      console.error('Diagnosis generation failed or returned unexpected format:', diagnosisResult);
      return { error: 'Failed to generate diagnosis or diagnosis format is incorrect.' };
    }

    // Step 2: Generate Report
    const reportInput = {
      diagnosis: diagnosisResult.diagnosis,
      certaintyScore: diagnosisResult.confidence,
      imageType: 'Radiograph', 
      additionalFindings: 'Not specified.',
    };
    const reportResult: GenerateReportOutput = await generateReport(reportInput);
    if (!reportResult || !reportResult.report) {
      console.error('Report generation failed or returned unexpected format:', reportResult);
      return { error: 'Failed to generate report.' };
    }

    return {
      data: {
        diagnosis: diagnosisResult.diagnosis,
        certaintyScore: diagnosisResult.confidence,
        reportText: reportResult.report,
      }
    };
  } catch (e) {
    console.error('Error in performDiagnosisAction:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during AI processing.';
    return { error: `AI Processing Error: ${errorMessage}` };
  }
}
