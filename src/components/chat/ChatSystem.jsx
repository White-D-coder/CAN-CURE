"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Send, Phone, Video, MoreVertical, Search, Paperclip, Smile } from 'lucide-react';

const ChatSystem = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  // Mock chat data
  const [chats, setChats] = useState([
    {
      id: 1,
      participant: {
        id: 'doctor1',
        name: 'Dr. Emily Richards',
        role: 'doctor',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
        online: true,
        lastSeen: 'now'
      },
      lastMessage: {
        text: 'Please schedule your follow-up appointment',
        timestamp: '2024-01-20T14:30:00Z',
        sender: 'doctor1'
      },
      unreadCount: 2,
      messages: [
        {
          id: 1,
          text: 'Hello, I have some questions about my recent test results.',
          timestamp: '2024-01-20T14:00:00Z',
          sender: user.id,
          read: true
        },
        {
          id: 2,
          text: 'I\'d be happy to help. What specific concerns do you have?',
          timestamp: '2024-01-20T14:05:00Z',
          sender: 'doctor1',
          read: true
        },
        {
          id: 3,
          text: 'The results show some elevated markers. Should I be worried?',
          timestamp: '2024-01-20T14:10:00Z',
          sender: user.id,
          read: true
        },
        {
          id: 4,
          text: 'Elevated markers don\'t necessarily indicate a problem. Let\'s schedule a consultation to discuss this in detail.',
          timestamp: '2024-01-20T14:15:00Z',
          sender: 'doctor1',
          read: true
        },
        {
          id: 5,
          text: 'Please schedule your follow-up appointment',
          timestamp: '2024-01-20T14:30:00Z',
          sender: 'doctor1',
          read: false
        }
      ]
    },
    {
      id: 2,
      participant: {
        id: 'doctor2',
        name: 'Dr. Robert Chen',
        role: 'doctor',
        avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
        online: false,
        lastSeen: '2 hours ago'
      },
      lastMessage: {
        text: 'Your treatment plan has been updated',
        timestamp: '2024-01-20T12:00:00Z',
        sender: 'doctor2'
      },
      unreadCount: 0,
      messages: [
        {
          id: 1,
          text: 'Good morning Dr. Chen, I have a question about my medication.',
          timestamp: '2024-01-20T11:00:00Z',
          sender: user.id,
          read: true
        },
        {
          id: 2,
          text: 'Your treatment plan has been updated',
          timestamp: '2024-01-20T12:00:00Z',
          sender: 'doctor2',
          read: true
        }
      ]
    }
  ]);

  // Filter chats based on search term
  const filteredChats = chats.filter(chat =>
    chat.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      timestamp: new Date().toISOString(),
      sender: user.id,
      read: false
    };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: {
                text: message,
                timestamp: new Date().toISOString(),
                sender: user.id
              }
            }
          : chat
      )
    );

    setMessage('');

    // Simulate doctor response after 2 seconds
    setTimeout(() => {
      const responses = [
        'I understand your concern. Let me check your records.',
        'Thank you for reaching out. I\'ll get back to you shortly.',
        'That\'s a good question. Let me review your case.',
        'I appreciate you bringing this to my attention.'
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const doctorResponse = {
        id: Date.now() + 1,
        text: randomResponse,
        timestamp: new Date().toISOString(),
        sender: selectedChat.participant.id,
        read: false
      };

      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === selectedChat.id
            ? {
                ...chat,
                messages: [...chat.messages, doctorResponse],
                lastMessage: {
                  text: randomResponse,
                  timestamp: new Date().toISOString(),
                  sender: selectedChat.participant.id
                },
                unreadCount: chat.id === selectedChat.id ? 0 : chat.unreadCount + 1
              }
            : chat
        )
      );
    }, 2000);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = (now - date) / (1000 * 60);

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat List Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={chat.participant.avatar}
                    alt={chat.participant.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {chat.participant.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {chat.participant.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {getRelativeTime(chat.lastMessage.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage.text}
                  </p>
                </div>
                {chat.unreadCount > 0 && (
                  <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={selectedChat.participant.avatar}
                    alt={selectedChat.participant.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {selectedChat.participant.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedChat.participant.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedChat.participant.online ? 'Online' : `Last seen ${selectedChat.participant.lastSeen}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                  <Phone size={20} />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                  <Video size={20} />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === user.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === user.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(msg.timestamp)}
                      {msg.sender === user.id && (
                        <span className="ml-1">
                          {msg.read ? '✓✓' : '✓'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                  <Smile size={20} />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSystem;
