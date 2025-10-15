"use client";

import React, { JSX, useEffect, useRef, useState } from "react";
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
  RefreshCw,
  Sparkles,
  Code2,
  Zap,
  User,
  Settings,
  Bell,
  LogOut,
  Menu,
  BarChart3,
  Shield,
} from "lucide-react";

const generateMockPosts = () => [
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
    publishedAt: new Date().toISOString(),
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
    publishedAt: new Date().toISOString(),
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
    publishedAt: new Date().toISOString(),
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
    publishedAt: new Date().toISOString(),
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
    publishedAt: new Date().toISOString(),
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
    publishedAt: new Date().toISOString(),
    url: "https://twitter.com",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
  },
];

const platformConfig: Record<
  string,
  { name: string; color: string; icon: JSX.Element }
> = {
  reddit: {
    name: "Reddit",
    color: "from-orange-500 to-red-500",
    icon: <Zap className="w-4 h-4" />,
  },
  twitter: {
    name: "Twitter",
    color: "from-blue-400 to-blue-600",
    icon: <Sparkles className="w-4 h-4" />,
  },
  instagram: {
    name: "Instagram",
    color: "from-pink-500 to-purple-500",
    icon: <Code2 className="w-4 h-4" />,
  },
  "dev.to": {
    name: "Dev.to",
    color: "from-gray-500 to-gray-700",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  default: {
    name: "Other",
    color: "from-gray-400 to-gray-600",
    icon: <Shield className="w-4 h-4" />,
  },
};

const Posts = () => {
  const [posts, setPosts] = useState<
    {
      publishedAt: string | number | Date;
      id: number;
      platform: string;
      author: string;
      title: string;
      content: string;
      tags: string[];
      likes: number;
      comments: number;
      timestamp: string;
      url: string;
      thumbnail: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [stats, setStats] = useState({ total: 0, today: 0, platforms: 0 });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    setLoading(true);
    setTimeout(() => {
      const mockPosts = generateMockPosts();
      setPosts(mockPosts);
      setStats({
        total: mockPosts.length,
        today: mockPosts.filter((p) => {
          const diff = Date.now() - new Date(p.publishedAt).getTime();
          return diff < 24 * 60 * 60 * 1000;
        }).length,
        platforms: new Set(mockPosts.map((p) => p.platform)).size,
      });
      setLoading(false);
    }, 800);
  };

  const handleScrape = async () => {
    setScraping(true);
    setTimeout(() => {
      setScraping(false);
      loadPosts();
    }, 3000);
  };

  const filteredPosts = posts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesPlatform =
        selectedPlatform === "all" || post.platform === selectedPlatform;
      return matchesSearch && matchesPlatform;
    })
    .sort((a, b) => {
      if (sortBy === "popular") return b.likes - a.likes;
      if (sortBy === "discussed") return b.comments - a.comments;
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });

  const platforms = ["all", ...new Set(posts.map((p) => p.platform))];

  const formatTimeAgo = (date: string | number | Date) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 animate-pulse border border-white/10"
            >
              <div className="bg-white/10 h-48 rounded-xl mb-4"></div>
              <div className="bg-white/10 h-6 rounded mb-3"></div>
              <div className="bg-white/10 h-4 rounded w-2/3 mb-2"></div>
              <div className="bg-white/10 h-4 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-300">
              Found{" "}
              <span className="text-purple-400 font-semibold text-lg">
                {filteredPosts.length}
              </span>{" "}
              posts
            </p>
            {filteredPosts.length > 0 && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Showing latest content</span>
              </div>
            )}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No posts found
              </h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedPlatform("all");
                }}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => {
                const config =
                  platformConfig[post.platform] || platformConfig.reddit;
                return (
                  <article
                    key={post.id}
                    className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div
                        className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-white text-xs font-semibold bg-gradient-to-r ${config.color} shadow-lg flex items-center gap-1`}
                      >
                        <span>{config.icon}</span>
                        <span>{config.name}</span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                          {post.author[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-300 font-medium truncate">
                            @{post.author}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(post.publishedAt)}
                          </p>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {post.content}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-medium hover:bg-purple-500/30 transition-colors cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="px-2.5 py-1 bg-gray-700/50 text-gray-400 rounded-lg text-xs font-medium">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex gap-4 text-gray-400 text-sm">
                          <button className="flex items-center gap-1.5 hover:text-pink-400 transition-colors group/like">
                            <Heart className="w-4 h-4 group-hover/like:fill-pink-400" />
                            <span className="font-medium">
                              {formatNumber(post.likes)}
                            </span>
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span className="font-medium">
                              {formatNumber(post.comments)}
                            </span>
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-green-400 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
                        >
                          View
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Posts;
