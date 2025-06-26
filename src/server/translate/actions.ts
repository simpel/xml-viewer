"use server";

import { z } from "zod";
import { scrapePage } from "@/clients/firecrawl";
import { translateText } from "@/clients/openai";

const translateSchema = z.object({
  promptInstructions: z.string().optional(),
  url: z.string().url("Please enter a valid URL"),
  language: z.enum(
    [
      "swedish",
      "english",
      "german",
      "klingon",
      "a language you make up by yourself",
    ],
    {
      required_error: "Please select a language",
    }
  ),
  mainContentOnly: z.boolean(),
});

export type TranslateFormData = z.infer<typeof translateSchema>;

export interface TranslationResult {
  original: string;
  translated: string;
  screenshots: string[];
  url: string;
  toLanguage: string;
}

export async function translatePage(
  formData: FormData
): Promise<TranslationResult> {
  const validatedFields = translateSchema.safeParse({
    promptInstructions: formData.get("promptInstructions"),
    url: formData.get("url"),
    language: formData.get("language"),
    mainContentOnly: formData.get("mainContentOnly") === "true",
  });

  if (!validatedFields.success) {
    throw new Error("Invalid form data");
  }

  const { url, language, mainContentOnly, promptInstructions } =
    validatedFields.data;

  try {
    // Step 1: Scrape the page
    const scrapedPage = await scrapePage(url, mainContentOnly);

    if (!scrapedPage.markdown) {
      throw new Error("No markdown found in the scraped page");
    }

    console.log("scrapedPage:", scrapedPage);

    // Step 2: Translate the content
    const translation = await translateText(
      scrapedPage.markdown,
      language,
      promptInstructions
    );

    console.log("translation:", translation);

    const result: TranslationResult = {
      original: scrapedPage.markdown || "",
      translated: translation.translatedText,
      screenshots: scrapedPage.actions.screenshots || "",
      url,
      toLanguage: language,
    };

    return result;
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Failed to translate page. Please try again.");
  }
}
