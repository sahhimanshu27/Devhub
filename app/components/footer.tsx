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

export const Footer = () => {
  return (
    <footer className="relative bg-black/20 backdrop-blur-xl border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <p className="text-gray-300 font-medium">
            Built with Next.js, React, Tailwind CSS, and Prisma
          </p>
        </div>
        <p className="text-sm text-gray-500 mb-2">
          Aggregating posts from Reddit, Dev.to, Hacker News, GitHub, and more
        </p>
        <p className="text-xs text-gray-600">Himanshu Sah</p>
      </div>
    </footer>
  );
};
