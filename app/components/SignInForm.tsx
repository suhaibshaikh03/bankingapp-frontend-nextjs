"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "../components/Button";

interface SignInFormProps {
  onSignIn?: (credentials: { username: string; password: string }) => void;
}

export default function SignInForm({ onSignIn }: SignInFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSignIn) {
      onSignIn({ username, password });
    } else {
      // Default behavior if no callback provided
      console.log("Sign in attempt with:", { username, password });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
          Email
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="block w-full px-4 py-3 rounded-lg shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 text-gray-900 bg-white bg-opacity-90 backdrop-blur-sm"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full px-4 py-3 rounded-lg shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 text-gray-900 bg-white bg-opacity-90 backdrop-blur-sm"
          placeholder="Enter your password"
        />
      </div>

      <Button
        type="submit"
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition duration-300"
      >
        Sign In
      </Button>

      <div className="text-center">
        <p className="text-white">
          Don't have an account?{" "}
          <Link href="/signup" className="font-medium text-indigo-200 hover:text-white">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}