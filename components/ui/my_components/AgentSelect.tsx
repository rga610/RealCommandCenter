// components/ui/my_components/AgentSelect.tsx
"use client";

import React, { useEffect, useState } from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@/lib/utils"; // your helper to merge classes
import { Label } from "@/components/ui/label"; // assuming you have this component

// Define the Agent interface.
export interface Agent {
  id: string;
  name: string;
}

// Define props for AgentSelect.
export interface AgentSelectProps {
  // The currently selected agent's id.
  value?: string;
  // Callback fired when an agent is selected.
  onChange: (value: string, agent?: Agent) => void;
  // Optional error message.
  error?: string;
  // Optional label; default is "Select an Agent".
  label?: string;
}

export default function AgentSelect({
  value,
  onChange,
  error,
  label = "Select an Agent",
}: AgentSelectProps) {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    async function loadAgents() {
      try {
        const res = await fetch("/api/airtable/agents");
        const data = await res.json();

        console.log("📌 Received agents in Frontend:", data);

        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid agents data received");
        }

        // Map the response to our Agent interface.
        const agentsList: Agent[] = data.map((r: any) => ({
          id: r.id,
          name: r.name,
        }));
        setAgents(agentsList);
      } catch (error) {
        console.error("🚨 Error loading agents:", error);
        setAgents([]);
      }
    }
    loadAgents();
  }, []);

  return (
    <div className="w-full">
      <Label htmlFor="agentSelect" className="block text-sm font-medium text-primary-dark mb-1">
        {label}
      </Label>

      <Select.Root
        value={value || ""}
        onValueChange={(selectedValue: string) => {
          const selectedAgent = agents.find((agent) => agent.id === selectedValue);
          if (selectedAgent) {
            onChange(selectedAgent.id, selectedAgent);
          } else {
            onChange("");
          }
        }}
      >
        <Select.Trigger
          id="agentSelect"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-accent-gold-light focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error ? " focus:ring-accent-gold-light" : "border-input focus:ring-accent-gold-light",
            value ? "bg-white text-primary-dark" : "bg-gray-50 text-gray-400"
          )}
          aria-invalid={!!error}
        >
          <Select.Value placeholder="Select an agent" />
          <Select.Icon asChild>
            <ChevronDown className="h-4 w-4 text-primary-medium" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-input bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-accent-gold-light"
          >
            <Select.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
              <ChevronUp className="h-4 w-4 text-primary-medium" />
            </Select.ScrollUpButton>
            <Select.Viewport className="p-2">
              {agents
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((agent) => (
                  <Select.Item
                    key={agent.id}
                    value={agent.id}
                    className="relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent-gold-light focus:text-primary-dark"
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <Select.ItemIndicator>
                        <Check className="h-4 w-4 text-primary-dark" />
                      </Select.ItemIndicator>
                    </span>
                    <Select.ItemText>{agent.name}</Select.ItemText>
                  </Select.Item>
                ))}
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
