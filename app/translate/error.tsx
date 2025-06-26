"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Translate page error:", error);
  }, [error]);

  return (
    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
      <h2 className="text-destructive font-semibold mb-2">
        Something went wrong!
      </h2>
      <p className="text-destructive text-sm mb-4">
        {error.message ||
          "An unexpected error occurred while processing the translation."}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition"
      >
        Try again
      </button>
    </div>
  );
}
