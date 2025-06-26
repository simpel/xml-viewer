import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy } from "lucide-react";

interface MarkdownProps {
  children: string | null | undefined;
}

const Markdown: React.FC<MarkdownProps> = ({ children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (children) {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div className="relative">
      <button
        className="absolute top-2 right-2 z-10 p-1 rounded hover:bg-gray-200 transition"
        onClick={handleCopy}
        title={copied ? "Copied!" : "Copy markdown"}
        type="button"
      >
        <Copy className="w-5 h-5 text-gray-500" />
        {copied && (
          <span className="absolute -top-7 right-0 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow">
            Copied!
          </span>
        )}
      </button>
      <ReactMarkdown
        components={{
          h1: (props) => <h1 className="text-3xl font-bold my-4" {...props} />,
          h2: (props) => (
            <h2 className="text-2xl font-semibold my-3" {...props} />
          ),
          h3: (props) => (
            <h3 className="text-xl font-semibold my-2" {...props} />
          ),
          h4: (props) => (
            <h4 className="text-lg font-semibold my-2" {...props} />
          ),
          h5: (props) => (
            <h5 className="text-base font-semibold my-1" {...props} />
          ),
          h6: (props) => (
            <h6 className="text-sm font-semibold my-1" {...props} />
          ),
          p: (props) => (
            <p className="my-2 text-base leading-relaxed" {...props} />
          ),
          img: (props) => (
            <img className="rounded shadow max-w-full my-2" {...props} />
          ),
          a: (props) => (
            <a
              className="text-blue-600 underline hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          ul: (props) => (
            <ul className="list-disc list-inside my-2 pl-5" {...props} />
          ),
          ol: (props) => (
            <ol className="list-decimal list-inside my-2 pl-5" {...props} />
          ),
          li: (props) => <li className="ml-2" {...props} />,
          blockquote: (props) => (
            <blockquote
              className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4"
              {...props}
            />
          ),
          code: (props) => (
            <code
              className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm"
              {...props}
            />
          ),
          pre: (props) => (
            <pre
              className="bg-gray-900 text-gray-100 rounded p-4 overflow-x-auto my-4"
              {...props}
            />
          ),
          hr: (props) => <hr className="my-6 border-gray-300" {...props} />,
          strong: (props) => <strong className="font-bold" {...props} />,
          em: (props) => <em className="italic" {...props} />,
          table: (props) => (
            <table
              className="min-w-full border border-gray-300 my-4"
              {...props}
            />
          ),
          thead: (props) => <thead className="bg-gray-100" {...props} />,
          tbody: (props) => <tbody {...props} />,
          tr: (props) => <tr className="border-b border-gray-200" {...props} />,
          th: (props) => (
            <th
              className="px-4 py-2 text-left font-semibold bg-gray-50 border-b border-gray-300"
              {...props}
            />
          ),
          td: (props) => (
            <td className="px-4 py-2 border-b border-gray-200" {...props} />
          ),
          del: (props) => (
            <del className="line-through text-gray-500" {...props} />
          ),
          ins: (props) => (
            <ins className="underline text-green-600" {...props} />
          ),
          sup: (props) => <sup className="align-super text-xs" {...props} />,
          sub: (props) => <sub className="align-sub text-xs" {...props} />,
        }}
      >
        {children || ""}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
