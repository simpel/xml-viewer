"use server";
import Sitemapper from "sitemapper";

export interface SitemapSite {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  sitemap?: string;
}

function isSitemapSiteArray(arr: unknown): arr is SitemapSite[] {
  return (
    Array.isArray(arr) &&
    arr.every(
      (site) =>
        typeof site === "object" &&
        site !== null &&
        "loc" in site &&
        typeof (site as { loc: unknown }).loc === "string"
    )
  );
}

async function getSitemapUrlFromRobots(domain: string): Promise<string | null> {
  try {
    const robotsUrl = domain.replace(/\/$/, "") + "/robots.txt";
    const res = await fetch(robotsUrl, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const text = await res.text();
    const match = text.match(/^\s*Sitemap:\s*(\S+)/im);
    if (match) {
      return match[1];
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchSitemap(
  domain: string
): Promise<SitemapSite[] | { error: string }> {
  // Try robots.txt first
  let sitemapUrl = await getSitemapUrlFromRobots(domain);
  if (!sitemapUrl) {
    sitemapUrl = domain.replace(/\/$/, "") + "/sitemap.xml";
  }
  const sitemap = new Sitemapper({
    url: sitemapUrl,
    timeout: 15000,
    fields: {
      loc: true,
      lastmod: true,
      changefreq: true,
      priority: true,
      sitemap: true,
    },
  });
  try {
    const { sites } = await sitemap.fetch();
    if (isSitemapSiteArray(sites)) {
      return sites;
    }
    return { error: `Unexpected sitemap format (Tried: ${sitemapUrl})` };
  } catch (e) {
    let message = "Failed to fetch sitemap";
    if (
      typeof e === "object" &&
      e &&
      "message" in e &&
      typeof (e as { message?: unknown }).message === "string"
    ) {
      message = (e as { message: string }).message;
    }
    return { error: `${message} (Tried: ${sitemapUrl})` };
  }
}
