"use client";

import React, { useState } from "react";
import useSWR from "swr";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/default/label";

export interface Agent {
  id: string;
  name: string;
}

export interface AgentSelectProps {
  value?: string;
  onChange: (value: string, agent?: Agent) => void;
  error?: string;
  label?: string;
  enableRefresh?: boolean;
}

// --- SWR fetcher for agents ---
const fetchAgents = async (url: string): Promise<Agent[]> => {
  // Add a cache-busting timestamp for the GET request
  const urlWithTimestamp = `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`;
  console.log(`Fetching agents from: ${urlWithTimestamp}`);

  const res = await fetch(urlWithTimestamp, { cache: "no-store" });
  if (!res.ok) {
    console.error(`Error fetching agents: ${res.status}`);
    throw new Error("Failed to load agents");
  }

  const data = await res.json();
  console.log(`Received ${Array.isArray(data) ? data.length : "unknown"} agents`);

  // If data is an array, return it. If it's { agents: [...] }, return data.agents
  return Array.isArray(data) ? data : data.agents || [];
};

export default function AgentSelect({
  value,
  onChange,
  error,
  label = "Select an Agent",
  enableRefresh = true,
}: AgentSelectProps) {
  // We'll keep a single SWR key for GET requests
  const AGENTS_GET_KEY = "/api/airtable/agents";

  // Use SWR to fetch the agents from GET /api/airtable/agents
  const {
    data: agents = [],
    mutate,
    isValidating,
    isLoading,
  } = useSWR<Agent[]>(AGENTS_GET_KEY, fetchAgents, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
    dedupingInterval: 5000, // 5 seconds
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const isCurrentlyLoading = isLoading || isValidating || isRefreshing;

  // Handle manual refresh by calling POST /api/airtable/agents/refresh
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      console.log("🔄 Manually refreshing agent list via POST endpoint...");

      const refreshRes = await fetch("/api/airtable/agents/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store",
        },
        cache: "no-store",
      });

      if (!refreshRes.ok) {
        throw new Error(`Failed to refresh agents: ${refreshRes.status}`);
      }

      const freshAgents = await refreshRes.json();
      console.log(
        `Received ${Array.isArray(freshAgents) ? freshAgents.length : "unknown"} fresh agents`
      );

      // Immediately update SWR's cache for the same key
      // so our dropdown sees the new data
      await mutate(freshAgents, {
        revalidate: false, // Don't refetch from GET endpoint, trust our new data
      });

      console.log("✅ SWR cache updated with fresh agents");
    } catch (error) {
      console.error("Failed to refresh agents:", error);

      // Optional: Force a re-fetch from GET if something failed
      await mutate(); // revalidate from the server
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <Label htmlFor="agentSelect" className="block text-sm font-medium text-primary-dark">
          {label}
        </Label>

        {enableRefresh && (
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isCurrentlyLoading}
            className="inline-flex items-center text-xs text-primary-medium hover:text-primary-dark disabled:opacity-50"
          >
            <RefreshCw
              className={cn(
                "h-3 w-3 mr-1",
                isCurrentlyLoading && "animate-spin"
              )}
            />
            {isCurrentlyLoading ? "Refreshing..." : "Refresh"}
          </button>
        )}
      </div>

      <Select.Root
        value={value || ""}
        onValueChange={(selectedValue: string) => {
          const selectedAgent = agents.find((agent) => agent.id === selectedValue);
          onChange(selectedAgent ? selectedAgent.id : "", selectedAgent);
        }}
      >
        <Select.Trigger
          id="agentSelect"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-accent-gold-light focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "focus:ring-red-500 border-red-500"
              : "border-input focus:ring-accent-gold-light",
            value ? "bg-white text-primary-dark" : "bg-gray-50 text-gray-400",
            isCurrentlyLoading && "opacity-70"
          )}
          aria-invalid={!!error}
          disabled={isCurrentlyLoading}
        >
          <Select.Value placeholder="Select an agent" />
          <Select.Icon asChild>
            <ChevronDown className="h-4 w-4 text-primary-medium" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-input bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-accent-gold-light"
            position="popper"
            sideOffset={4}
          >
            <Select.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
              <ChevronUp className="h-4 w-4 text-primary-medium" />
            </Select.ScrollUpButton>
            <Select.Viewport className="p-2">
              {isCurrentlyLoading ? (
                <div className="py-2 px-8 text-sm text-gray-500">Loading agents...</div>
              ) : agents.length === 0 ? (
                <div className="py-2 px-8 text-sm text-gray-500">No agents found</div>
              ) : (
                agents.map((agent) => (
                  <Select.Item
                    key={agent.id}
                    value={agent.id}
                    className="relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent-gold-light focus:text-primary-dark hover:bg-accent-gold-lighter"
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <Select.ItemIndicator>
                        <Check className="h-4 w-4 text-primary-dark" />
                      </Select.ItemIndicator>
                    </span>
                    <Select.ItemText>{agent.name}</Select.ItemText>
                  </Select.Item>
                ))
              )}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
              <ChevronDown className="h-4 w-4 text-primary-medium" />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
