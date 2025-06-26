"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2, Globe } from "lucide-react";
import { generateSystemPrompt } from "@/lib/prompts";

const translateSchema = z.object({
  promptInstructions: z.string().optional(),
  url: z.string().url("Please enter a valid URL"),
  language: z.string(),
  mainContentOnly: z.boolean(),
});

export type TranslateFormData = z.infer<typeof translateSchema>;

interface TranslateFormProps {
  onSubmit: (data: TranslateFormData) => void;
  isPending: boolean;
}

export function TranslateForm({ onSubmit, isPending }: TranslateFormProps) {
  const form = useForm<TranslateFormData>({
    resolver: zodResolver(translateSchema),
    defaultValues: {
      promptInstructions: "",
      url: "",
      language: "english",
      mainContentOnly: true,
    },
  });

  const watchLanguage = form.watch("language");
  const watchPromptInstructions = form.watch("promptInstructions");
  const systemPrompt = watchLanguage
    ? generateSystemPrompt(watchLanguage, watchPromptInstructions)
    : "";

  const handleSubmit = (data: TranslateFormData) => {
    onSubmit(data);
  };

  const getButtonText = () => {
    if (!isPending) return "Translate Page";

    return "Translating...";
  };

  const getButtonIcon = () => {
    if (!isPending) return <Globe className="mr-2 h-4 w-4" />;
    return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 mb-8"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Language</FormLabel>
              <Select onValueChange={field.onChange} disabled={isPending}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="swedish">Swedish</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="klingon">Klingon</SelectItem>
                  <SelectItem value="a language you make up by yourself">
                    Let the AI make up a language for you
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="promptInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter custom instructions for translation..."
                  className="min-h-[100px]"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mainContentOnly"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-1 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  Main content only
                </FormLabel>
                <p className="text-xs text-muted-foreground">
                  Extract only the main content, excluding navigation, headers,
                  and footers
                </p>
              </div>
            </FormItem>
          )}
        />

        <Accordion
          type="single"
          collapsible
          className="w-full bg-amber-50 rounded-2 px-4"
        >
          <AccordionItem value="system-prompt">
            <AccordionTrigger>See system prompt</AccordionTrigger>
            <AccordionContent>
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                {systemPrompt || "Select a language to see the system prompt"}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button type="submit" disabled={isPending} className="w-full md:w-auto">
          {getButtonIcon()}
          {getButtonText()}
        </Button>
      </form>
    </Form>
  );
}
