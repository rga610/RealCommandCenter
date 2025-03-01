// components/ui/my_components/ModuleTabs.tsx

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/default/tabs";
import { FileText } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/modules/ToolTip";

export interface Tab {
  value: string;
  label: string;
  description: string;
  icon?: JSX.Element;
  component: JSX.Element;
  tooltipText?: string; // optional help text
}

interface ModuleTabsProps {
  tabs: Tab[];
}

export default function ModuleTabs({ tabs }: ModuleTabsProps) {
  return (
    <Tabs defaultValue={tabs[0]?.value ?? ""} className="space-y-8">
      <TabsList className="w-full border-b p-0 h-auto bg-white rounded-t-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-2">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              // 1) Add 'group' so we can style the child (?) icon on hover
              className="
                group
                w-full flex flex-col items-start p-4 gap-2 rounded-lg
                data-[state=active]:border-b-2 data-[state=active]:border-accent-gold
                data-[state=active]:hover:bg-gray-100 hover:bg-primary-light hover:text-white
                data-[state=active]:hover:text-primary-light
                transition-colors
                relative
              "
            >
              {/* Top row: label on the left, (?) on the right */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  {tab.icon ?? <FileText className="h-5 w-5" />}
                  <span className="font-medium">{tab.label}</span>
                </div>

                {/* Only show (?) if we have tooltip text */}
                {tab.tooltipText && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label="Help"
                        // 2) Circle styling & hover states
                        className="
                          w-5 h-5 flex items-center justify-center
                          rounded-full text-xs
                          bg-gray-100
                          text-gray-400
                          transition-colors
                          // Change color on parent regular (inactive) hover
                          group-hover:bg-gray-200
                          group-hover:text-primary-dark
                          // If active tab, hover is different
                          group-[data-state=active]:hover:bg-black
                          group-[data-state=active]:hover:text-primary-light
                        "
                      >
                        ?
                      </button>
                    </TooltipTrigger>
                    <TooltipContent markdown={tab.tooltipText} />
                  </Tooltip>
                )}
              </div>

              {/* Short description under the top row */}
              <p className="text-sm text-left max-w-[300px] truncate">
                {tab.description}
              </p>
            </TabsTrigger>
          ))}
        </div>
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="bg-white rounded-lg shadow-lg p-6">
            {tab.component}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
