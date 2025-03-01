"use client";

import React, { useEffect, useState } from "react";

interface GreetingSectionProps {
  user: any;
}

export default function GreetingSection({ user }: GreetingSectionProps) {
  const [greeting, setGreeting] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else if (hour >= 17) {
      setGreeting("Good evening");
    } else {
      setGreeting("Good morning");
    }
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-serif text-primary-dark mb-2">
        {greeting}, {user?.firstName || user?.username?.split(" ")[0]}
      </h2>
      <p className="text-primary-medium">What are you going to achieve today?</p>
    </section>
  );
}
