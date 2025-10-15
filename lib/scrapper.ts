import axios from "axios";
import * as cheerio from "cheerio";

interface ScrapedPost {
  platform: string;
  author: string;
  authorUrl?: string;
  title: string;
  content: string;
  url: string;
  thumbnail?: string | null;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  publishedAt: Date;
}

export async function scrapeReddit(): Promise<ScrapedPost[]> {
  const posts: ScrapedPost[] = [];
  const subreddits = [
    "programming",
    "webdev",
    "learnprogramming",
    "javascript",
    "reactjs",
    "python",
    "rust",
    "golang",
    "typescript",
    "devops",
  ];

  for (const subreddit of subreddits) {
    try {
      const response = await axios.get(
        `https://www.reddit.com/r/${subreddit}/hot.json?limit=30`,
        {
          headers: { "User-Agent": "DevHub/1.0" },
        }
      );
      const data = response.data.data.children;

      for (const item of data) {
        const post = item.data;
        if (post.stickied || post.is_self === false) continue;

        posts.push({
          platform: "reddit",
          author: post.author,
          authorUrl: `https://reddit.com/u/${post.author}`,
          title: post.title,
          content: post.selftext || post.title,
          url: `https://reddit.com${post.permalink}`,
          thumbnail: post.thumbnail?.startsWith("http") ? post.thumbnail : null,
          tags: [
            subreddit,
            ...(post.link_flair_text
              ? [post.link_flair_text.toLowerCase().replace(/\s+/g, "-")]
              : []),
          ],
          likes: post.ups,
          comments: post.num_comments,
          shares: 0,
          publishedAt: new Date(post.created_utc * 1000),
        });
      }

      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error scraping r/${subreddit}:`, (error as any).message);
    }
  }

  return posts;
}

export async function scrapeDevTo(): Promise<ScrapedPost[]> {
  const posts: ScrapedPost[] = [];
  const tags = [
    "javascript",
    "python",
    "webdev",
    "programming",
    "react",
    "typescript",
    "nodejs",
    "tutorial",
  ];

  for (const tag of tags) {
    try {
      const response = await axios.get(
        `https://dev.to/api/articles?tag=${tag}&per_page=30&top=7`
      );
      const articles = response.data;

      for (const article of articles) {
        posts.push({
          platform: "dev.to",
          author: article.user.username,
          authorUrl: `https://dev.to/${article.user.username}`,
          title: article.title,
          content: article.description || article.title,
          url: article.url,
          thumbnail: article.cover_image || article.social_image,
          tags: article.tag_list,
          likes: article.public_reactions_count,
          comments: article.comments_count,
          shares: 0,
          publishedAt: new Date(article.published_at),
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(
        `Error scraping Dev.to tag ${tag}:`,
        (error as any).message
      );
    }
  }

  return posts;
}

export async function scrapeHackerNews(): Promise<ScrapedPost[]> {
  const posts: ScrapedPost[] = [];

  try {
    const topStories = await axios.get(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    const storyIds = topStories.data.slice(0, 50);

    const storyPromises = storyIds.map((id: any) =>
      axios
        .get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        .catch((err) => ({ data: null }))
    );

    const stories = await Promise.all(storyPromises);

    for (const response of stories) {
      const story = response.data;

      if (story && story.type === "story" && story.url) {
        posts.push({
          platform: "hackernews",
          author: story.by,
          authorUrl: `https://news.ycombinator.com/user?id=${story.by}`,
          title: story.title,
          content: story.text || story.title,
          url: story.url,
          thumbnail: null,
          tags: ["programming", "tech", "news"],
          likes: story.score,
          comments: story.descendants || 0,
          shares: 0,
          publishedAt: new Date(story.time * 1000),
        });
      }
    }
  } catch (error) {
    console.error("Error scraping Hacker News:", (error as any).message);
  }

  return posts;
}

export async function scrapeGitHubTrending(): Promise<ScrapedPost[]> {
  const posts: ScrapedPost[] = [];
  const languages = [
    "javascript",
    "python",
    "typescript",
    "rust",
    "go",
    "java",
    "csharp",
  ];

  for (const language of languages) {
    try {
      const response = await axios.get(
        `https://github.com/trending/${language}?since=daily`,
        {
          headers: { "User-Agent": "DevHub/1.0" },
        }
      );
      const $ = cheerio.load(response.data);

      $("article.Box-row").each((i, elem) => {
        if (i >= 10) return;

        const title = $(elem).find("h2 a").text().trim().replace(/\s+/g, " ");
        const url = "https://github.com" + $(elem).find("h2 a").attr("href");
        const description = $(elem).find("p").text().trim();
        const starsText = $(elem)
          .find("span.d-inline-block.float-sm-right")
          .first()
          .text()
          .trim();
        const stars = parseInt(starsText.replace(/,/g, "")) || 0;

        if (title && url) {
          posts.push({
            platform: "github",
            author: title.split("/")[0].trim(),
            authorUrl: url,
            title: title,
            content: description || title,
            url: url,
            thumbnail: null,
            tags: [language, "opensource", "github", "trending"],
            likes: stars,
            comments: 0,
            shares: 0,
            publishedAt: new Date(),
          });
        }
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(
        `Error scraping GitHub ${language}:`,
        (error as any).message
      );
    }
  }

  return posts;
}

export async function scrapeAllPlatforms(): Promise<ScrapedPost[]> {
  console.log("Starting to scrape all platforms...");

  const [reddit, devto, hackernews, github] = await Promise.allSettled([
    scrapeReddit(),
    scrapeDevTo(),
    scrapeHackerNews(),
    scrapeGitHubTrending(),
  ]);

  const allPosts: ScrapedPost[] = [];

  if (reddit.status === "fulfilled") {
    console.log(`Reddit: ${reddit.value.length} posts`);
    allPosts.push(...reddit.value);
  } else {
    console.error("Reddit scraping failed:", reddit.reason);
  }

  if (devto.status === "fulfilled") {
    console.log(`Dev.to: ${devto.value.length} posts`);
    allPosts.push(...devto.value);
  } else {
    console.error("Dev.to scraping failed:", devto.reason);
  }

  if (hackernews.status === "fulfilled") {
    console.log(`Hacker News: ${hackernews.value.length} posts`);
    allPosts.push(...hackernews.value);
  } else {
    console.error("Hacker News scraping failed:", hackernews.reason);
  }

  if (github.status === "fulfilled") {
    console.log(`GitHub: ${github.value.length} posts`);
    allPosts.push(...github.value);
  } else {
    console.error("GitHub scraping failed:", github.reason);
  }

  console.log(`Total posts scraped: ${allPosts.length}`);
  return allPosts;
}
