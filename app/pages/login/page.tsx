"use client";
import Loading from "@/app/components/loading";
import React, { FormEvent } from "react";

export default function Login() {
  const [loading, setLoading] = React.useState(false);
  const [focused, setFocused] = React.useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: formData,
    });

    const data = response;
    if (data.status === 200) {
      const responseData = await data.json();
      alert("Login successful");
      document.cookie = `token=${responseData.token}; path=/; max-age=86400`;
      window.location.href = "/";
    } else {
      const errorData = await data.json();
      alert(errorData.error || "Login failed");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      {loading && <Loading />}
      <form
        onSubmit={onSubmit}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 w-full max-w-md p-8"
        encType="application/x-www-form-urlencoded"
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent text-center p-4">
          Login
        </h2>

        {/* Email Field */}
        <div className="relative mb-6">
          <input
            type="email"
            name="email"
            id="email"
            required
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            className={`peer w-full px-3 py-3 border border-gray-300 rounded-lg bg-transparent text-white placeholder-transparent focus:outline-none focus:ring-2 transition-all duration-300 ${
              focused === "email"
                ? "focus:ring-purple-400 focus:border-purple-400 shadow-lg shadow-purple-500/20"
                : "focus:ring-blue-400 focus:border-blue-400"
            }`}
            placeholder="Email"
          />
          <label
            htmlFor="email"
            className="absolute left-3 top-3 text-gray-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-purple-400"
          >
            Email
          </label>
        </div>

        {/* Password Field */}
        <div className="relative mb-8">
          <input
            type="password"
            name="password"
            id="password"
            required
            onFocus={() => setFocused("password")}
            onBlur={() => setFocused(null)}
            className={`peer w-full px-3 py-3 border border-gray-300 rounded-lg bg-transparent text-white placeholder-transparent focus:outline-none focus:ring-2 transition-all duration-300 ${
              focused === "password"
                ? "focus:ring-pink-400 focus:border-pink-400 shadow-lg shadow-pink-500/20"
                : "focus:ring-blue-400 focus:border-blue-400"
            }`}
            placeholder="Password"
          />
          <label
            htmlFor="password"
            className="absolute left-3 top-3 text-gray-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-pink-400"
          >
            Password
          </label>
        </div>

        <button
          type="submit"
          name="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-purple-500/30"
        >
          Login
        </button>
      </form>
    </div>
  );
}
