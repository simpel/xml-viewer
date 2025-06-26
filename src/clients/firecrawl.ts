import FirecrawlApp from "@mendable/firecrawl-js";

console.log(process.env.FIRECRAWL_API_KEY, "jey");

const app = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY!,
});

export async function scrapePage(
  url: string,
  mainContentOnly: boolean = false
) {
  const response = await app.scrapeUrl(url, {
    formats: ["markdown"],
    onlyMainContent: mainContentOnly,
    actions: [
      {
        type: "screenshot",
        fullPage: true,
      },
    ],
  });

  if (!response.success) {
    throw new Error(`Failed to scrape: ${response.error}`);
  }

  return response;
}
