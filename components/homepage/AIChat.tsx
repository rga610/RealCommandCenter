"use client";

import React, { useState } from "react";
import {
  Minimize2,
  Maximize2,
  Send,
  MessageSquare,
} from "lucide-react";

export default function AIChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { type: "user" | "assistant"; content: string }[]
  >([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Append the user message.
      setChatMessages((prev) => [...prev, { type: "user", content: message }]);
      // Simulate an assistant response.
      setChatMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: "I understand you need help. I'm here to assist you.",
        },
      ]);
      setMessage("");
    }
  };

  return (
    <>
      {isChatOpen && (
        <div
          className={`fixed bottom-20 right-4 bg-white rounded-lg shadow-xl transition-all duration-300 ${
            isExpanded ? "w-96 h-[600px]" : "w-80 h-[400px]"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium text-primary-dark">AI Assistant</h3>
            <div className="flex items-center gap-2">
              {isExpanded ? (
                <Minimize2
                  className="w-5 h-5 cursor-pointer text-primary-medium hover:text-primary-dark"
                  onClick={() => setIsExpanded(false)}
                />
              ) : (
                <Maximize2
                  className="w-5 h-5 cursor-pointer text-primary-medium hover:text-primary-dark"
                  onClick={() => setIsExpanded(true)}
                />
              )}
              <button
                className="text-primary-medium hover:text-primary-dark"
                onClick={() => setIsChatOpen(false)}
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-4 h-[calc(100%-8rem)] overflow-y-auto">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${msg.type === "user" ? "text-right" : ""}`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    msg.type === "user"
                      ? "bg-primary-dark text-white"
                      : "bg-background text-primary-dark"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleSendMessage()
                }
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-primary-dark text-white rounded-lg hover:bg-primary-medium transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 right-4 p-4 bg-primary-dark text-white rounded-full shadow-lg hover:bg-primary-medium transition-colors"
      >
        <MessageSquare size={24} />
      </button>
    </>
  );
}
