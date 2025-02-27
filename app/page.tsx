// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from 'next/link'
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Bell,
  MessageSquarePlus,
  Building2,
  Users,
  LayoutDashboard,
  Link as LinkIcon,
  Calendar,
  ExternalLink,
  MessageSquare,
  Maximize2,
  Minimize2,
  Send,
} from "lucide-react";


export default function Home() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // Start blank to avoid SSR mismatch
  const [greeting, setGreeting] = useState("");

  // AI Chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { type: "user" | "assistant"; content: string }[]
  >([]);

  // 1) Optional: handle a client-side sign-in requirement
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/auth/signin");
    }
  }, [isLoaded, isSignedIn, router]);

  // 2) dynamic greeting on client only
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else if (hour >= 17) {
      setGreeting("Good evening");
    } else {
      setGreeting("Good morning");
    }
  }, []);

  // If Clerk is not loaded, show spinner
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // If not signed in => just hide everything (the client redirect above will push to /auth/signin)
  if (!isSignedIn) {
    return null;
  }

  // fallback profile image
  const profileImage = user?.imageUrl || "/images/placeholders/agent.jpg";

  // handle AI chat
  const handleSendMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, { type: "user", content: message }]);
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
      <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-start gap-6 flex-col md:flex-row">
            <div className="relative w-32 h-32">
              <img
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-serif text-primary-dark mb-2">
                {user?.fullName || user?.username}
              </h1>
              <p className="text-primary-medium mb-4">Real Estate Agent</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="bg-background p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-primary-dark mb-1">
                    <Users size={20} />
                    <span className="font-medium">Seller Leads</span>
                  </div>
                  <p className="text-2xl font-bold text-primary-dark">
                    24<span className="text-sm font-normal text-gray-600">
                      /36
                    </span>
                  </p>
                </div>

                <div className="bg-background p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-primary-dark mb-1">
                    <Building2 size={20} />
                    <span className="font-medium">Buyer Leads</span>
                  </div>
                  <p className="text-2xl font-bold text-primary-dark">
                    18<span className="text-sm font-normal text-gray-600">
                      /28
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Notifications Center */}
            <div className="w-full md:w-80 bg-background p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-primary-dark flex items-center gap-2">
                  <Bell size={20} />
                  Recent Notifications
                </h3>
                <span className="bg-primary-dark text-white text-xs px-2 py-1 rounded-full">
                  3 new
                </span>
              </div>
              <div className="space-y-3">
                <div className="border-l-4 border-accent-gold bg-white p-3 rounded shadow-sm">
                  <p className="text-sm text-primary-dark">
                    New inquiry for Villa Paradise
                  </p>
                  <p className="text-xs text-gray-500">10 minutes ago</p>
                </div>
                <div className="border-l-4 border-primary-light bg-white p-3 rounded shadow-sm">
                  <p className="text-sm text-primary-dark">
                    Meeting with John Doe scheduled
                  </p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
                <div className="border-l-4 border-primary-light bg-white p-3 rounded shadow-sm">
                  <p className="text-sm text-primary-dark">
                    Property viewing confirmed
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Greeting Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-primary-dark mb-2">
            {greeting && `${greeting}, ${user?.firstName || user?.username?.split(" ")[0]}`}
          </h2>
          <p className="text-primary-medium">
            What are you going to achieve today?
          </p>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* List Properties: no role checks => always shown */}
          <Link
            href="/list-properties"
            className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300"
          >
            <Building2 className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
            <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">
              List Properties
            </h2>
            <p className="text-primary-medium">
              Manage seller inquiries and listing processes
            </p>
          </Link>

          {/* Sell Properties: always shown */}
          <Link
            href="/sell-properties"
            className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300"
          >
            <Users className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
            <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">
              Sell Properties
            </h2>
            <p className="text-primary-medium">
              Manage buyer inquiries and selling processes
            </p>
          </Link>

          {/* Marketing: always shown */}
          <Link
            href="/marketing"
            className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300"
          >
            <MessageSquarePlus className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
            <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">
              Marketing
            </h2>
            <p className="text-primary-medium">
              Market our brand and specific listings
            </p>
          </Link>

          {/* Dashboard: always shown */}
          <Link
            href="/dashboard"
            className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300"
          >
            <LayoutDashboard className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
            <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">
              Dashboard
            </h2>
            <p className="text-primary-medium">
              View analytics and performance metrics
            </p>
          </Link>
        </div>

        {/* Additional Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
          {/* Useful Links */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <LinkIcon className="w-6 h-6 text-primary-dark" />
              <h2 className="text-xl font-serif text-primary-dark">Useful Links</h2>
            </div>
            <div className="space-y-3">
              <Link
                href="#"
                className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-primary-dark">MLS Database</span>
                <ExternalLink size={16} className="text-primary-medium" />
              </Link>
              <Link
                href="#"
                className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-primary-dark">Property Documents</span>
                <ExternalLink size={16} className="text-primary-medium" />
              </Link>
              <Link
                href="#"
                className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-primary-dark">Marketing Resources</span>
                <ExternalLink size={16} className="text-primary-medium" />
              </Link>
            </div>
          </div>

          {/* Calendar Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-primary-dark" />
              <h2 className="text-xl font-serif text-primary-dark">
                Calendar Overview
              </h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-background rounded-lg">
                <p className="text-primary-dark font-medium">Property Viewing</p>
                <p className="text-sm text-gray-600">
                  Today, 2:00 PM - Villa Paradise
                </p>
              </div>
              <div className="p-3 bg-background rounded-lg">
                <p className="text-primary-dark font-medium">Client Meeting</p>
                <p className="text-sm text-gray-600">
                  Tomorrow, 10:00 AM - John Doe
                </p>
              </div>
              <div className="p-3 bg-background rounded-lg">
                <p className="text-primary-dark font-medium">Property Photoshoot</p>
                <p className="text-sm text-gray-600">Wed, 9:00 AM - Sunset Villa</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Chat */}
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
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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

        {/* AI Assistant Toggle Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-4 right-4 p-4 bg-primary-dark text-white rounded-full shadow-lg hover:bg-primary-medium transition-colors"
        >
          <MessageSquare size={24} />
        </button>
      </main>
    </>
  );
}
