"use client"; // Add this directive at the top of the file

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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
            <span className="text-teal-500">●</span>
            <span className="text-black">Cure</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#what-we-do" className="text-gray-700 hover:text-teal-500 transition-colors">
            What we do
          </Link>
          <div className="relative group">
            <button className="flex items-center text-gray-700 hover:text-teal-500 transition-colors">
              Our offerings
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
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
          <Link href="#pricing" className="text-gray-700 hover:text-teal-500 transition-colors">
            Pricing
          </Link>
          <Link href="#blog" className="text-gray-700 hover:text-teal-500 transition-colors">
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

      {/* Chat button */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={toggleChat}
          className="bg-teal-500 text-white p-3 rounded-full shadow-lg hover:bg-teal-600 transition-colors"
        >
          Chat
        </button>
      </div>

      {/* Chat modal */}
      {isChatOpen && (
        <div
          style={{ zIndex: '999', backgroundColor: 'rgba(90, 207, 199, 0.4)' }}
          className="fixed bottom-16 right-10 w-full md:w-1/3 shadow-lg rounded-t-lg p-4"
        >
          <h2 className="text-lg font-semibold mb-2">Chat with us</h2>
          <p className="text-gray-600 mb-4">
            How can we assist you today?
          </p>
          {/* Chat content */}
          <div className="h-64 overflow-y-auto border border-gray-300 rounded-lg p-2 mb-4">
            {/* Chat messages go here */}
            {messages.map((message, index) => (
              <div key={index} className="mb-2">
              <strong>{message.sender}:</strong> {message.text}
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full border border-gray-300 rounded-lg p-2 mb-2"
          />
          <button
            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
          >
            Send
          </button>
          {/* Chat content goes here */}
          <button
            onClick={toggleChat}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 h-12 w-12"
          >
            ×
          </button>
        </div>
      )}
    </header>
  );
}