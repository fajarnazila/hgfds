import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { firebase } from '@genkit-ai/firebase/plugin';

export const ai = genkit({
  plugins: [
    googleAI(),
    firebase(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
