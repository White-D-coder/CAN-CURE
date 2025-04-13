"use client"; // Add this directive at the top of the file

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Sidebar } from "lucide-react";
import SideBar from "./SideBar";

export function Navbar() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "Agent", text: "Hello! How can we assist you with cancer treatment today?" },
  ]);
  const [userInput, setUserInput] = useState("");

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message to the chat
    const newMessages = [...messages, { sender: "User", text: userInput }];
    setMessages(newMessages);
    setUserInput("");

    // Fetch response from the backend
    try {
      const response = await fetch("/api/cancer-treatment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userInput }),
      });
      const data = await response.json();

      // Add agent's response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Agent", text: data.answer || "Sorry, I couldn't find an answer to your question." },
      ]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Agent", text: "There was an error fetching the data. Please try again later." },
      ]);
    }
  };
  
  

  return (
    <header className="w-full py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="text-black mr-1">Can</span>
            <span className="text-teal-500 animate-pulse">●</span>
            <span className="text-black">Cure</span>
          </Link>
        </div>

        <nav
          className="hidden md:flex items-center space-x-8"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.5)", // Adjusted for translucency
            marginLeft: "-30px",
            marginRight: "-30px",
            paddingLeft: "50px",
            paddingRight: "50px",
            paddingTop: "10px",
            paddingBottom: "10px",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            zIndex: 10,
            position: "relative",
            top: "5px",
            left: "0",
            right: "0",
            bottom: "0",
            gap: "20px",
          }}
        >
            <Link href="/sidebar" className="text-gray-700 hover:text-teal-500 transition-colors">
              Report Analyzer
            </Link>

          <Link href="/contact" className="text-gray-700 hover:text-teal-500 transition-colors">
            Contact Us
          </Link>
          <Link href="/blog" className="text-gray-700 hover:text-teal-500 transition-colors">
            Blog
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            href="/demo"
            className="bg-white text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center font-medium transition-colors border border-gray-200"
          >
            Get Demo
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1 h-4 w-4"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}