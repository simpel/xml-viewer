"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <div className="border-b px-4 h-20">
      <div className="flex items-center gap-8 h-full">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-primary-foreground">
            🤡
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant={pathname === "/xml" ? "default" : "ghost"}
            size="sm"
          >
            <Link href="/xml">
              <FileText className="h-4 w-4 mr-2" />
              XML Viewer
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/translate" ? "default" : "ghost"}
            size="sm"
          >
            <Link href="/translate">
              <Globe className="h-4 w-4 mr-2" />
              Translate
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
