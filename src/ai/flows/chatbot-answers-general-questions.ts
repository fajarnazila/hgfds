'use server';
/**
 * @fileOverview Implements a Genkit flow for answering general questions about the school using an AI chatbot.
 *
 * - answerQuestion - A function that takes a question as input and returns an answer from the chatbot.
 * - ChatbotInput - The input type for the answerQuestion function.
 * - ChatbotOutput - The return type for the answerQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotInputSchema = z.object({
  question: z.string().describe('The question to ask the chatbot about the school.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  answer: z.string().describe('The chatbot answer to the question.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function answerQuestion(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  prompt: `You are a helpful AI chatbot for SMK LPPMRI 2 KEDUNGREJA, a vocational high school in Indonesia. Answer the following question about the school:

Question: {{{question}}}`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
