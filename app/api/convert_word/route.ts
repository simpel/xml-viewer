import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import { translateText } from "@/clients/openai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;
    const systemPrompt = formData.get("systemPrompt") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("File size:", file.size);
    console.log("Buffer length:", buffer.length);

    const result = await mammoth.convertToHtml({ buffer });
    const html = result.value; // The generated HTML
    // const messages = result.messages; // Any messages, such as warnings

    let output = html;

    if (systemPrompt) {
      try {
        const translation = await translateText(html, "English", systemPrompt);
        output = translation.translatedText;
        console.log({ html, translation: output });
      } catch (translationError) {
        console.error("Error during translation:", translationError);
        // Optionally, handle this error more gracefully
      }
    }

    return NextResponse.json({ html: output });
  } catch (error) {
    console.error("Error converting document:", error);
    return NextResponse.json(
      { error: "Error converting document." },
      { status: 500 }
    );
  }
}
