"use client";

import Link from "next/link";

export default function WhatWeDo() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">What We Do</h1>
        <p className="text-lg text-gray-600 mb-4">
          At CAN-CURE, we are committed to providing innovative solutions for cancer treatment. Our mission is to
          empower patients and healthcare providers with the tools and knowledge they need to combat cancer effectively.
        </p>
        <p className="text-lg text-gray-600 mb-4">
          We offer personalized treatment plans, advanced diagnostic tools, and access to the latest research in
          oncology. Our team of experts is dedicated to supporting you every step of the way.
        </p>
        <p className="text-lg text-gray-600 mb-4">
          Explore our offerings to learn more about how we can assist you in your journey toward better health.
        </p>
        <Link
          href="/"
          className="text-teal-500 hover:text-teal-600 font-medium transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}