"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation"; // Corrected navigation for Next.js
import AuthContext from "@/context/AuthContext"; // Adjust path based on your structure

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Signup failed");

      const data = await res.json();
      login(data.accessToken);
      router.push("/login"); // Redirect after successful signup
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-slate-800 to-slate-900">
    <div className="bg-slate-700 p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
      <h2 className="text-3xl font-bold text-center text-slate-200 mb-6">Sign Up</h2>
      {error && (
        <p className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded-md mb-4">
          {error}
        </p>
      )}
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-800 text-slate-200 placeholder-slate-400"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-800 text-slate-200 placeholder-slate-400"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-800 text-slate-200 placeholder-slate-400"
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 active:scale-95"
        >
          Sign Up
        </button>
      </form>
      <p className="text-center text-sm text-slate-400 mt-6">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-blue-400 hover:text-blue-300 hover:underline transition-all"
        >
          Login
        </a>
      </p>
    </div>
  </div>
  );
};

export default Signup;
