"use client";
import React from 'react';
import { Footer } from '../../components/Footer';
import GoogleDoctorsMap from '../../components/mapping/GoogleDoctorsMap';

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <GoogleDoctorsMap />
      </main>
      <Footer />
    </div>
  );
}
