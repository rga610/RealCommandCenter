"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  MessageSquarePlus,
  LayoutDashboard,
} from "lucide-react";

export interface ActionCard {
  href: string;
  icon: JSX.Element;
  title: string;
  description: string;
}

export interface ActionCardsProps {
  cards?: ActionCard[];
}

export default function ActionCards({
  cards,
}: ActionCardsProps) {
  // Default action cards
  const defaultCards: ActionCard[] = [
    {
      href: "/list-properties",
      icon: (
        <Building2 className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
      ),
      title: "List Properties",
      description: "Manage seller inquiries and listing processes",
    },
    {
      href: "/sell-properties",
      icon: (
        <Users className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
      ),
      title: "Sell Properties",
      description: "Manage buyer inquiries and selling processes",
    },
    {
      href: "/marketing",
      icon: (
        <MessageSquarePlus className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
      ),
      title: "Marketing",
      description: "Market our brand and specific listings",
    },
    {
      href: "/media",
      icon: (
        <MessageSquarePlus className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
      ),
      title: "Media",
      description: "Manage company and listing media",
    },
    {
      href: "/metrics",
      icon: (
        <LayoutDashboard className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
      ),
      title: "metrics",
      description: "View analytics and performance metrics",
    },
  ];

  // Use provided cards if any; otherwise, use defaults
  const actionCards = cards || defaultCards;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {actionCards.map((card, idx) => (
        <Link
          key={idx}
          href={card.href}
          className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300"
        >
          {card.icon}
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light transition-colors">
            {card.title}
          </h2>
          <p className="text-primary-medium">{card.description}</p>
        </Link>
      ))}
    </div>
  );
}
