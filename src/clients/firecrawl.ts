import FirecrawlApp from "@mendable/firecrawl-js";

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

  console.log({ response });

  if (!response.success) {
    throw new Error(`Failed to scrape: ${response.error}`);
  }

  return response;
}
