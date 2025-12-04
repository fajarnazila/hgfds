'use server';

/**
 * @fileOverview An AI agent that answers questions about the admission process.
 *
 * - chatbotAnswersAdmissionQuestions - A function that answers questions about the admission process.
 * - ChatbotAnswersAdmissionQuestionsInput - The input type for the chatbotAnswersAdmissionQuestions function.
 * - ChatbotAnswersAdmissionQuestionsOutput - The return type for the chatbotAnswersAdmissionQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotAnswersAdmissionQuestionsInputSchema = z.object({
  question: z.string().describe('The question about the admission process.'),
});
export type ChatbotAnswersAdmissionQuestionsInput = z.infer<
  typeof ChatbotAnswersAdmissionQuestionsInputSchema
>;

const ChatbotAnswersAdmissionQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type ChatbotAnswersAdmissionQuestionsOutput = z.infer<
  typeof ChatbotAnswersAdmissionQuestionsOutputSchema
>;

export async function chatbotAnswersAdmissionQuestions(
  input: ChatbotAnswersAdmissionQuestionsInput
): Promise<ChatbotAnswersAdmissionQuestionsOutput> {
  return chatbotAnswersAdmissionQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotAnswersAdmissionQuestionsPrompt',
  input: {schema: ChatbotAnswersAdmissionQuestionsInputSchema},
  output: {schema: ChatbotAnswersAdmissionQuestionsOutputSchema},
  prompt: `You are an AI chatbot for SMK LPPMRI 2 KEDUNGREJA, a vocational high school (SMK) in Indonesia. Answer questions about the admission process. Be accurate and helpful.\n\nQuestion: {{{question}}}`,
});

const chatbotAnswersAdmissionQuestionsFlow = ai.defineFlow(
  {
    name: 'chatbotAnswersAdmissionQuestionsFlow',
    inputSchema: ChatbotAnswersAdmissionQuestionsInputSchema,
    outputSchema: ChatbotAnswersAdmissionQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
