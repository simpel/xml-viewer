"use client";

import { useState } from "react";

import TiptapEditor from "@/components/ui/tiptap-editor";
import { UploadWordForm } from "@/forms/upload-word-form";
import { Button } from "@/components/ui/button";

export default function ProcessFilesPage() {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("document");

  const handleUploadSuccess = (html: string, fileName: string) => {
    setHtmlContent(html);
    setUploadedFileName(fileName);
  };

  const handleDownloadDocx = async () => {
    try {
      const response = await fetch("/api/convert_html_to_docx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ htmlContent }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `translated_${uploadedFileName}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading DOCX:", error);
      alert("Failed to download DOCX file. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {htmlContent ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Edit and download</h1>
          <TiptapEditor content={htmlContent} onChange={setHtmlContent} />
          <div className="mt-4">
            <Button onClick={handleDownloadDocx}>
              {`Download translated_${uploadedFileName}.docx`}
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Upload Word Document</h1>
          <UploadWordForm onSuccess={handleUploadSuccess} />
        </>
      )}
    </div>
  );
}
