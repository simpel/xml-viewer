"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import { Button } from "@/components/ui/button";
import "./tiptap-editor.css";
import { ScrollArea } from "./scroll-area";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "",
      },
    },
  });

  return (
    <div className="relative">
      {editor && (
        <div className="flex flex-wrap gap-1 p-2">
          <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            variant={editor.isActive("bold") ? "secondary" : "ghost"}
            size="sm"
          >
            Bold
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            variant={editor.isActive("italic") ? "secondary" : "ghost"}
            size="sm"
          >
            Italic
          </Button>
          <Button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            variant={
              editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"
            }
            size="sm"
          >
            H1
          </Button>
          <Button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            variant={
              editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"
            }
            size="sm"
          >
            H2
          </Button>
          <Button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            variant={
              editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"
            }
            size="sm"
          >
            H3
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
            size="sm"
          >
            Bullet List
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
            size="sm"
          >
            Ordered List
          </Button>
          <Button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            variant="ghost"
            size="sm"
          >
            Undo
          </Button>
          <Button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            variant="ghost"
            size="sm"
          >
            Redo
          </Button>
        </div>
      )}
      <ScrollArea className="h-[500px] mt-4 border rounded-md p-4">
        <EditorContent editor={editor} className="tiptap-editor" />
      </ScrollArea>
    </div>
  );
};

export default TiptapEditor;
