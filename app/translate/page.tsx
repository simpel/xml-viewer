"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import prettyMs from "pretty-ms";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  translatePage,
  type TranslationResult,
} from "@/server/translate/actions";
import { TranslateForm, type TranslateFormData } from "@/forms/translate-form";
import Markdown from "@/components/markdown";
import EditableMarkDown from "@/components/editable-markdown";
import { useEditor } from "@wysimark/react";

export default function TranslatePage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editableValue, setEditableValue] = useState("");

  const originalScrollRef = useRef<HTMLDivElement>(null);
  const translatedScrollRef = useRef<HTMLDivElement>(null);
  const wysimarkEditor = useEditor({});

  const onSubmit = (data: TranslateFormData) => {
    setError(null);
    setResult(null);
    setEditableValue("");

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("promptInstructions", data.promptInstructions || "");
        formData.append("url", data.url);
        formData.append("language", data.language);
        formData.append("mainContentOnly", data.mainContentOnly.toString());

        const result = await translatePage(formData);
        setResult(result);

        const cleanTranslatedContent = result?.translated || "";
        setEditableValue(cleanTranslatedContent);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    });
  };

  useEffect(() => {
    console.log(result);
  }, [result]);

  return (
    <div>
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-[300px_1fr] h-[calc(100vh-80px)]">
        {/* First Column - Form */}
        <div className="w-[300px] border-r border-gray-200 p-2">
          <TranslateForm onSubmit={onSubmit} isPending={isPending} />
        </div>

        {/* Second Column - Results */}
        <div className="flex-1">
          {!result ? (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300">
              <p className="text-muted-foreground text-lg">
                {isPending
                  ? "Translating (its gonna take some time)..."
                  : "Nothing translated yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-rows-[auto_1fr] h-full ">
              <div className="flex gap-2 items-center justify-between px-4 py-2 bg-green-100 border border-green-200">
                <div className="flex gap-2 items-center">
                  {result?.screenshots.map((screenshot, index) => (
                    <div className="relative w-full h-10" key={index}>
                      <img
                        src={screenshot}
                        alt="Dynamic image"
                        className="w-full h-full"
                      />
                    </div>
                  ))}
                </div>

                <div className="text-sm flex items-center gap-6">
                  <p>
                    {result?.url} was translated to {result?.toLanguage}
                  </p>
                  <p>Translation took {prettyMs(result?.duration)}</p>
                </div>
              </div>

              {/* Second Row - Translation Comparison */}
              <div className="grid grid-cols-2 h-full">
                {/* Original Content */}
                <ScrollArea className="h-full ">
                  <div ref={originalScrollRef} className="p-2">
                    <div className="prose prose-sm max-w-none">
                      <Markdown>{result?.original}</Markdown>
                    </div>
                  </div>
                </ScrollArea>
                <ScrollArea className="h-full relative">
                  <div ref={translatedScrollRef} className="p-2">
                    <EditableMarkDown
                      value={editableValue}
                      onChange={setEditableValue}
                      editor={wysimarkEditor}
                      placeholder="Translated content will appear here..."
                    />
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
