"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Sidebar, User, LogOut } from "lucide-react";
import SideBar from "./SideBar";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "./auth/LoginModal";
import RegisterModal from "./auth/RegisterModal";

export function Navbar() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "Agent", text: "Hello! How can we assist you with cancer treatment today?" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();

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
            <Link href="/map" className="text-gray-700 hover:text-teal-500 transition-colors">
              Find Doctors
            </Link>
            <Link href="/analytics" className="text-gray-700 hover:text-teal-500 transition-colors">
              Analytics
            </Link>
            <Link href="/chat" className="text-gray-700 hover:text-teal-500 transition-colors">
              Chat
            </Link>

          <Link href="/contact" className="text-gray-700 hover:text-teal-500 transition-colors">
            Contact Us
          </Link>
          <Link href="/blog" className="text-gray-700 hover:text-teal-500 transition-colors">
            Blog
          </Link>
          
          {isAuthenticated && (
            <>
              {user.role === 'doctor' && (
                <Link href="/doctor" className="text-gray-700 hover:text-teal-500 transition-colors">
                  Doctor Portal
                </Link>
              )}
              {user.role === 'admin' && (
                <Link href="/admin" className="text-gray-700 hover:text-teal-500 transition-colors">
                  Admin Panel
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span className="text-sm">{user.name}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-3 py-1 rounded-lg flex items-center text-sm hover:bg-red-700 transition-colors"
              >
                <LogOut size={14} className="mr-1" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowLogin(true)}
                className="bg-white text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-200"
              >
                Login
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
      
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />
      
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </header>
  );
}
