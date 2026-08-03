import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Instance principale pour tous les appels GenAI
export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
});
