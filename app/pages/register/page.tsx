"use client";
import React, { FormEvent } from "react";

export default function register() {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log(data);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <form onSubmit={onSubmit}>
        <input type="email" name="email" />
        <input type="password" name="password" />
        <button type="submit" name="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
