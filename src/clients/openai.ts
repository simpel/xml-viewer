import OpenAI from "openai";
import { generateSystemPrompt } from "@/lib/prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export { generateSystemPrompt };

export interface TranslationResult {
  translatedText: string;
  originalText: string;
}

export async function translateText(
  text: string,
  targetLanguage: string,
  promptInstructions?: string
): Promise<TranslationResult> {
  const systemPrompt = generateSystemPrompt(targetLanguage, promptInstructions);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
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
    temperature: 0.3,
  });

  const translatedText = response.choices[0]?.message?.content || "";

  return {
    translatedText,
    originalText: text,
  };
}
