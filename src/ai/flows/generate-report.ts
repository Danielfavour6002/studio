'use server';

/**
 * @fileOverview Generates a readable report based on the diagnosis of a medical image.
 *
 * - generateReport - A function that generates the report.
 * - GenerateReportInput - The input type for the generateReport function.
 * - GenerateReportOutput - The return type for the generateReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportInputSchema = z.object({
  diagnosis: z.string().describe('The diagnosis generated by the AI.'),
  certaintyScore: z
    .number()
    .describe('The certainty score of the diagnosis (0-1).'),
  imageType: z.string().describe('The type of medical image (e.g., X-ray, MRI).'),
  additionalFindings: z
    .string()
    .optional()
    .describe('Any additional findings from the image.'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
  report: z.string().describe('The generated readable report.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

export async function generateReport(input: GenerateReportInput): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: {schema: GenerateReportInputSchema},
  output: {schema: GenerateReportOutputSchema},
  prompt: `You are a medical reporting assistant. You generate a report based on a diagnosis, certainty score, image type, and any additional findings.

Diagnosis: {{{diagnosis}}}
Certainty Score: {{{certaintyScore}}}
Image Type: {{{imageType}}}
Additional Findings: {{{additionalFindings}}}

Generate a concise and readable report that summarizes the diagnosis, includes the certainty score, specifies the image type, and mentions any additional findings. Format the report in a way that is easily understandable for medical professionals.
`,
});

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
