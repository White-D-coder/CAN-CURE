"use client";

import { useState } from "react";

export default function ChatBot() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "Agent", text: "Hello! How can we assist you with cancer treatment today?" },
    ]);
    const [userInput, setUserInput] = useState("");
    const [tabs, setTabs] = useState(["General Info", "Treatment Options", "Support"]);

    const toggleChat = () => setIsChatOpen((prev) => !prev);

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        const newMessages = [...messages, { sender: "User", text: userInput }];
        setMessages(newMessages);
        setUserInput("");

        try {
            const response = await fetch("/api/cancer-treatment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: userInput }),
            });
            const data = await response.json();

            setMessages((prev) => [
                ...prev,
                { sender: "Agent", text: data.answer || "Sorry, I couldn't find an answer to your question." },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { sender: "Agent", text: "There was an error fetching the data. Please try again later." },
            ]);
        }
    };

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={toggleChat}
                className="fixed bottom-4 right-4 bg-teal-500 text-white p-3 rounded-full shadow-lg hover:bg-teal-600 transition-colors"
            >
                💬
            </button>

            {/* Chat Modal */}
            {isChatOpen && (
                <div className="fixed bottom-16 right-4 w-80 bg-white shadow-lg rounded-lg border border-gray-200">
                    <header className="p-4 flex justify-between items-center border-b">
                        <h3 className="text-lg font-medium">Chat with us</h3>
                        <button onClick={toggleChat} className="text-gray-500 hover:text-gray-700">
                            ✖
                        </button>
                    </header>
                    <nav className="p-4 border-b">
                        <ul className="flex space-x-4">
                            {tabs.map((tab, index) => (
                                <li key={index} className="text-teal-500 hover:underline cursor-pointer">
                                    {tab}
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <main className="p-4 h-64 overflow-y-auto">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`mb-2 ${message.sender === "User" ? "text-right" : "text-left"}`}
                            >
                                <strong>{message.sender}:</strong> {message.text}
                            </div>
                        ))}
                    </main>
                    <footer className="p-4 border-t">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Type your message..."
                            className="w-full border border-gray-300 rounded-lg p-2 mb-2"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors w-full"
                        >
                            Send
                        </button>
                    </footer>
                </div>
            )}
        </>
    );
}
