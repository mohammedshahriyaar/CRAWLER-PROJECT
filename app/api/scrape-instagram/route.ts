import { NextRequest, NextResponse } from "next/server";
import { PlaywrightCrawler, Dataset } from "crawlee";
import { v4 as uuidv4 } from "uuid";

interface ReelData {
  title: string; // Optional (you may choose to use caption or description)
  views: number;
  likes: number;
  comments: number;
  thumbnail: string;
}

interface ProfileData {
  reelsList: ReelData[];
  graphData: { name: string; views: number }[];
}

export async function POST(request: NextRequest) {
  const { profileUrl } = await request.json();

  if (!profileUrl) {
    return NextResponse.json(
      { error: "Profile URL is required" },
      { status: 400 }
    );
  }

  const uuid = uuidv4();
  const dataset = await Dataset.open(`instagram-reels-${uuid}`);

  const crawler = new PlaywrightCrawler({
    maxRequestsPerCrawl: 50,
    async requestHandler({ request, page, log }) {
      log.info(`Processing ${request.url}...`);

      // Go to the Instagram profile page
      await page.goto(request.url, { waitUntil: 'networkidle' });

      // Wait for the reels grid to load
      await page.waitForSelector("article div a", { timeout: 30000 });

      // Scroll to load all reels (Instagram uses infinite scroll)
      await page.evaluate(async () => {
        while (true) {
          const oldHeight = document.body.scrollHeight;
          window.scrollTo(0, document.body.scrollHeight);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          if (document.body.scrollHeight === oldHeight) break;
        }
      });

      // Extract reels data from the profile
      const reels: ReelData[] = await page.$$eval(
        "article div a", // Update the selector if needed for reels
        (elements) => {
            console.log(elements)
          return elements.map((el) => {
            const thumbnail = el.querySelector("img")?.src || "";
            const viewsText = el.querySelector(".view-count")?.textContent || "";
            const likesText = el.querySelector(".like-count")?.textContent || "";
            const commentsText = el.querySelector(".comment-count")?.textContent || "";

            const views = parseInt(viewsText.replace(/,/g, ""), 10);
            const likes = parseInt(likesText.replace(/,/g, ""), 10);
            const comments = parseInt(commentsText.replace(/,/g, ""), 10);

            return { title: "", views, likes, comments, thumbnail };
          });
        }
      );
      console.log(reels)

      log.info(`Found ${reels.length} reels on the profile`);

      await dataset.pushData(reels[0]);
    },

    failedRequestHandler({ request, log }) {
      log.error(`Request ${request.url} failed too many times.`);
    },
  });

  try {
    // Use a unique key for the request to bypass caching
    await crawler.run([{ url: profileUrl, uniqueKey: `${profileUrl}:${uuid}` }]);

    const results = await dataset.getData();
    const reels = (results.items[0]?.reels as ReelData[]) || [];

    const graphData = reels.map((reel, index) => ({
      name: `Reel ${index + 1}`,
      views: reel.views,
    }));

    const profileData: ProfileData = {
      reelsList: reels,
      graphData: graphData,
    };

    await dataset.drop();

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Crawling failed:", error);
    await dataset.drop();
    return NextResponse.json(
      { error: "An error occurred while scraping the Instagram profile" },
      { status: 500 }
    );
  }
}
