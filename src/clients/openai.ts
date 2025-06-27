import OpenAI from "openai";
import { generateSystemPrompt } from "@/lib/prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export { generateSystemPrompt };

export interface TranslationResult {
  translatedText: string;
  originalText: string;
  duration: number;
}

export async function translateText(
  text: string,
  targetLanguage: string,
  promptInstructions?: string
): Promise<TranslationResult> {
  const systemPrompt = generateSystemPrompt(targetLanguage, promptInstructions);

  const startDate = new Date();

  const response = await openai.chat.completions.create({
    model: "o4-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  const endDate = new Date();
  const duration = endDate.getTime() - startDate.getTime();
  console.log(`Translation took ${duration}ms`);

  const translatedText = response.choices[0]?.message?.content || "";

  return {
    translatedText,
    originalText: text,
    duration,
  };
}
