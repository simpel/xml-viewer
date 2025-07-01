import { NextRequest, NextResponse } from "next/server";
import * as htmlToDocx from "html-to-docx";

export async function POST(req: NextRequest) {
  try {
    const { htmlContent } = await req.json();

    if (!htmlContent) {
      return NextResponse.json({ error: "No HTML content provided." }, { status: 400 });
    }

    const docxBuffer = await htmlToDocx.default(htmlContent);
    const docxBlob = new Blob([docxBuffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

    return new NextResponse(docxBlob, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=\"document.docx\"",
      },
    });
  } catch (error) {
    console.error("Error converting HTML to DOCX:", error);
    return NextResponse.json(
      { error: "Error converting HTML to DOCX." },
      { status: 500 }
    );
  }
}