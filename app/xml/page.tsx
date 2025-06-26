"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "../../src/components/ui/form";
import { Input } from "../../src/components/ui/input";
import { Button } from "../../src/components/ui/button";
import { fetchSitemap, SitemapSite } from "../../src/helpers/sitemap";
import SitemapTree from "../../src/components/sitemap/tree";

interface TreeNodeType {
  __children: Record<string, TreeNodeType>;
  __site?: SitemapSite;
}

export default function Home() {
  const form = useForm<{ domain: string }>({ defaultValues: { domain: "" } });
  const [tree, setTree] = useState<Record<string, TreeNodeType> | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function onSubmit(data: { domain: string }) {
    setError("");
    setTree(null);
    // Clean the domain to only protocol + host
    let cleanedDomain = data.domain.trim();
    try {
      if (!/^https?:\/\//.test(cleanedDomain)) {
        cleanedDomain = "https://" + cleanedDomain;
      }
      const url = new URL(cleanedDomain);
      cleanedDomain = url.origin;
    } catch {
      setError("Invalid domain format");
      return;
    }
    startTransition(async () => {
      // Show the exact sitemap URL used
      const sitemapUrl = cleanedDomain.replace(/\/$/, "") + "/sitemap.xml";
      const result = await fetchSitemap(cleanedDomain);
      if ("error" in result) setError(`${result.error} (Tried: ${sitemapUrl})`);
      else setTree(buildTree(result));
    });
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-8 gap-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md"
        >
          <FormField
            control={form.control}
            name="domain"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter domain (e.g. https://example.com)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com" />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-4 w-full" disabled={isPending}>
            {isPending ? "Fetching..." : "Fetch Sitemap"}
          </Button>
        </form>
      </Form>
      {error && <div className="text-red-500">{error}</div>}
      {tree && <SitemapTree tree={tree} />}
    </div>
  );
}

// Helper to build a hierarchical tree from flat URLs
function buildTree(sites: SitemapSite[]): Record<string, TreeNodeType> {
  console.log(sites);

  const root: Record<string, TreeNodeType> = {};
  for (const site of sites) {
    const url = new URL(site.loc);
    const parts = url.pathname.split("/").filter(Boolean);
    let node: TreeNodeType = { __children: root };
    let parent = root;
    for (const part of parts) {
      if (!parent[part]) parent[part] = { __children: {} };
      node = parent[part];
      parent = node.__children;
    }
    node.__site = site;
  }
  return root;
}
