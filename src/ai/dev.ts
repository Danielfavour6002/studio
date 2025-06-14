import { config } from 'dotenv';
config();

import '@/ai/flows/generate-report.ts';
import '@/ai/flows/generate-diagnosis.ts';
import '@/ai/flows/determine-certainty-score.ts';