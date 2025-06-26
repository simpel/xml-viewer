"use client";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { Plus, Minus } from "lucide-react";

interface SitemapSite {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  sitemap?: string;
}

interface TreeNodeType {
  __children: Record<string, TreeNodeType>;
  __site?: SitemapSite;
}

function truncateUrl(url: string) {
  return url.length > 100 ? `...${url.slice(-100)}` : url;
}

function TreeNode({ node, name }: { node: TreeNodeType; name?: string }) {
  const [open, setOpen] = useState(false);
  const hasChildren =
    node && node.__children && Object.keys(node.__children).length > 0;
  const site = node.__site;
  return (
    <div className="ml-4 flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {hasChildren && (
          <Button
            variant="ghost"
            size="icon"
            className="p-1 px-2 py-1 h-7 w-7"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Collapse" : "Expand"}
            type="button"
          >
            {open ? (
              <Minus className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        )}
        {site && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="cursor-pointer underline decoration-dotted text-sm px-1 py-1 rounded hover:bg-accent/40 transition-colors"
                  tabIndex={0}
                >
                  {truncateUrl(site.loc)}
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs break-words">
                <div>
                  <b>URL:</b> {site.loc}
                </div>
                {site.lastmod && (
                  <div>
                    <b>Last Modified:</b> {site.lastmod}
                  </div>
                )}
                {site.changefreq && (
                  <div>
                    <b>Changefreq:</b> {site.changefreq}
                  </div>
                )}
                {site.priority && (
                  <div>
                    <b>Priority:</b> {site.priority}
                  </div>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {name && !site && (
          <span className="font-mono text-xs text-muted-foreground">
            {name}
          </span>
        )}
      </div>
      {hasChildren && open && (
        <div className="ml-4 border-l border-gray-300 pl-2">
          {Object.entries(node.__children).map(([child, childNode]) => (
            <TreeNode key={child} node={childNode} name={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SitemapTree({
  tree,
}: {
  tree: Record<string, TreeNodeType>;
}) {
  return (
    <div className="w-full max-w-2xl">
      {Object.entries(tree).map(([name, node]) => (
        <TreeNode key={name} node={node} name={name} />
      ))}
    </div>
  );
}
