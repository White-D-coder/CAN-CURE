"use client";
import React, { useState, useRef, useEffect } from "react";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyA5M_6YgNKhGqMIEB3hueqgM9W-qh-aghE`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `You are MedBot — a helpful, professional medical assistant. Always provide **accurate but non-diagnostic** advice. If users describe symptoms, advise them to consult a certified doctor for proper diagnosis.\n\nUser: ${input}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      const aiReply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand that.";

      setMessages([...newMessages, { role: "assistant", text: aiReply }]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...newMessages,
        { role: "assistant", text: "Error connecting to Gemini API." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-700">
          🩺 MedBot — Gemini AI
        </h1>

        <div className="h-96 overflow-y-auto border p-3 rounded-lg bg-gray-100 mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`my-2 p-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-200 text-right"
                  : "bg-green-200 text-left"
              }`}
            >
              <strong>{msg.role === "user" ? "You: " : "MedBot: "}</strong>
              {msg.text}
            </div>
          ))}
          {loading && (
            <p className="text-gray-500 italic text-center">Thinking...</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-lg p-2 focus:outline-blue-400"
            placeholder="Ask me about symptoms, medicines, or health tips..."
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
