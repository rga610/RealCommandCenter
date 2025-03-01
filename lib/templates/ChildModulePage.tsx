"use client";

import { MODULES } from "@/lib/modules/modules-directory";
import ChildModulePageTemplate from "@/components/modules/ChildModuleComponent";
import { FileText, FolderOpen, Bell } from "lucide-react";

// Import generic tool components (replace these with your actual tool components as needed)
import ToolOne from "@/lib/templates/DataFormTemplate";
import ToolTwo from "@/lib/templates/ToolTwo";
import ToolThree from "@/lib/templates/ToolThree";

export default function StaticChildModulePage() {
  // Grab parent module info from your global modules config.
  // Adjust the key (e.g. MODULES.list) as needed.
  const module = MODULES.list;

  // Define your tabs array with placeholder text
  const tabs = [
    {
      value: "tool-one",
      label: "Tool One",
      description: "Tool One description goes here...",
      tooltipText: `
# **Tool One Instructions**
---
**Step 1:** Do something  
**Step 2:** Do something else  
**Step 3:** Review your results  
`,
      icon: <FileText className="h-5 w-5" />,
      component: <ToolOne />,
    },
    {
      value: "tool-two",
      label: "Tool Two",
      description: "Tool Two description goes here...",
      tooltipText: `
# **Tool Two Instructions**
---
Detailed instructions for Tool Two go here.
`,
      icon: <FolderOpen className="h-5 w-5" />,
      component: <ToolTwo />,
    },
    {
      value: "tool-three",
      label: "Tool Three",
      description: "Tool Three description goes here...",
      tooltipText: `
# **Tool Three Instructions**
---
Additional guidance for Tool Three can be placed here.
`,
      icon: <Bell className="h-5 w-5" />,
      component: <ToolThree />,
    },
  ];

  return (
    <ChildModulePageTemplate
      moduleName={module.name}                      // e.g. "List Properties"
      modulePath={module.path}                      // e.g. "/list-properties"
      currentPage="Tool Page Title"                 // The title of this specific child page
      heading="Tool Page Title"                     // Main heading (replace with your own title)
      description="This is a placeholder description for the tool page. Add your specific description here."  // Description text
      tabs={tabs}
    />
  );
}
