// components\ui\my_components\ModuleTabs.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react"; // Default icon

interface Tab {
  value: string;
  label: string;
  description: string;
  icon?: JSX.Element; // Icon is now optional
  component: JSX.Element;
}

interface ModuleTabsProps {
  tabs: Tab[];
}

export default function ModuleTabs({ tabs }: ModuleTabsProps) {
  return (
    <Tabs defaultValue={tabs[0]?.value} className="space-y-8">
      <TabsList className="w-full border-b p-0 h-auto bg-white rounded-t-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-2"> {/*Change global setting for default number of columns here*/}
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="w-full flex flex-col items-start p-4 gap-2 rounded-lg 
                         data-[state=active]:border-b-2 data-[state=active]:border-accent-gold 
                         data-[state=active]:hover:bg-gray-100 hover:bg-primary-light hover:text-white data-[state=active]:hover:text-primary-light  transition-colors"
            >
              <div className="flex items-center gap-2">
                {tab.icon ?? <FileText className="h-5 w-5" />} {/* 🛠️ Default icon */}
                <span className="font-medium">{tab.label}</span>
              </div>
              <p className="text-sm text-left">{tab.description}</p>
            </TabsTrigger>
          ))}
        </div>
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="bg-white rounded-lg shadow-lg p-6">{tab.component}</div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

