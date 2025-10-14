import React from "react";
import {
  Search,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  Clock,
  Filter,
} from "lucide-react";

const platformColors = {
  reddit: "from-orange-500 to-red-500",
  twitter: "from-blue-400 to-blue-600",
  instagram: "from-purple-500 to-pink-500",
  "dev.to": "from-gray-700 to-gray-900",
  facebook: "from-blue-600 to-blue-800",
};

const platformIcons = {
  reddit: "🔶",
  twitter: "🐦",
  instagram: "📸",
  "dev.to": "💻",
  facebook: "📘",
};

const posts = [
  {
    id: 1,
    platform: "reddit",
    author: "dev_master",
    title: "Built a full-stack AI chatbot with Next.js and OpenAI",
    content:
      "Just finished building an AI-powered chatbot using Next.js 14, OpenAI API, and PostgreSQL. The app features real-time streaming responses...",
    tags: ["nextjs", "openai", "typescript", "postgresql"],
    likes: 1243,
    comments: 89,
    timestamp: "2 hours ago",
    url: "https://reddit.com/r/webdev",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    platform: "twitter",
    author: "code_wizard",
    title: "React 19 new features explained",
    content:
      "Thread: React 19 introduces game-changing features like Actions, useOptimistic, and improved Suspense. Here's what you need to know...",
    tags: ["react", "javascript", "webdev"],
    likes: 3421,
    comments: 156,
    timestamp: "5 hours ago",
    url: "https://twitter.com",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    platform: "instagram",
    author: "coding.daily",
    title: "Python data structures cheat sheet",
    content:
      "Master Python data structures with this visual guide! Swipe through for lists, tuples, sets, and dictionaries explained with examples.",
    tags: ["python", "programming", "tutorial"],
    likes: 2891,
    comments: 234,
    timestamp: "8 hours ago",
    url: "https://instagram.com",
    thumbnail:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop",
  },
  {
    id: 4,
    platform: "reddit",
    author: "rust_enthusiast",
    title: "Why I rewrote my Node.js API in Rust",
    content:
      "After 3 years of running a Node.js API in production, I decided to rewrite it in Rust. Here are my benchmarks and lessons learned...",
    tags: ["rust", "nodejs", "performance", "backend"],
    likes: 987,
    comments: 123,
    timestamp: "12 hours ago",
    url: "https://reddit.com/r/rust",
    thumbnail:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=250&fit=crop",
  },
  {
    id: 5,
    platform: "dev.to",
    author: "fullstack_dev",
    title: "Complete Guide to Docker for Developers",
    content:
      "Everything you need to know about Docker: from containers and images to multi-stage builds and docker-compose orchestration.",
    tags: ["docker", "devops", "tutorial"],
    likes: 1567,
    comments: 67,
    timestamp: "1 day ago",
    url: "https://dev.to",
    thumbnail:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=250&fit=crop",
  },
  {
    id: 6,
    platform: "twitter",
    author: "ai_researcher",
    title: "Fine-tuning LLMs on custom datasets",
    content:
      "Step-by-step guide to fine-tuning large language models on your own data. Using LoRA and QLoRA for efficient training on consumer GPUs.",
    tags: ["ai", "machinelearning", "llm", "python"],
    likes: 2134,
    comments: 98,
    timestamp: "1 day ago",
    url: "https://twitter.com",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
  },
];

const Header = () => {
  const platforms = ["all", ...new Set(posts.map((p) => p.platform))];
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              DevFeed
            </h1>
            <p className="text-gray-400 mt-1">
              Curated coding content from across the web
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all backdrop-blur-sm">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search posts, tags, or authors..."
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            //   value={selectedPlatform}
            //   onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {platforms.map((platform) => (
              <option key={platform} value={platform} className="bg-slate-800">
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </option>
            ))}
          </select>
          <select
            //   value={sortBy}
            //   onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="recent" className="bg-slate-800">
              Recent
            </option>
            <option value="popular" className="bg-slate-800">
              Popular
            </option>
          </select>
        </div>
      </div>
      //{" "}
    </div>
  );
};

export default Header;
