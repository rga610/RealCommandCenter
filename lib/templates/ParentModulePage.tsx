// app\lib\templates\ParentModulePage.tsx

"use client";

import ParentModule, { ChildModule } from "@/components/modules/ParentModuleComponent";
import {
  Users,
  ClipboardList,
  UserPlus,
  Database,
  Calculator,
  Camera,
  FileText,
  Globe,
  LineChart,
  Settings,
} from "lucide-react";

// Define the base path constant for your module
const BASE_PATH = "/your-module"; // change this once for your module

export default function YourParentModulePage() {
  // Define the child modules with generic placeholder text.
  const childModules: ChildModule[] = [
    {
      href: `${BASE_PATH}/child-module-one`,
      icon: <Users className="w-8 h-8 text-primary-dark" />,
      title: "Child Module One",
      description: "Description for Child Module One goes here.",
    },
    {
      href: `${BASE_PATH}/child-module-two`,
      icon: <ClipboardList className="w-8 h-8 text-primary-dark" />,
      title: "Child Module Two",
      description: "Description for Child Module Two goes here.",
    },
    {
      href: `${BASE_PATH}/child-module-three`,
      icon: <UserPlus className="w-8 h-8 text-primary-dark" />,
      title: "Child Module Three",
      description: "Description for Child Module Three goes here.",
    },
    {
      href: `${BASE_PATH}/child-module-four`,
      icon: <Database className="w-8 h-8 text-primary-dark" />,
      title: "Child Module Four",
      description: "Description for Child Module Four goes here.",
    },
    {
      href: `${BASE_PATH}/child-module-five`,
      icon: <Calculator className="w-8 h-8 text-primary-dark" />,
      title: "Child Module Five",
      description: "Description for Child Module Five goes here.",
    },
    {
      href: `${BASE_PATH}/child-module-six`,
      icon: <Camera className="w-8 h-8 text-primary-dark" />,
      title: "Child Module Six",
      description: "Description for Child Module Six goes here.",
    },
    {
      href: `${BASE_PATH}/child-module-seven`,
      icon: <FileText className="w-8 h-8 text-primary-dark" />,
      title: "Child Module Seven",
      description: "Description for Child Module Seven goes here.",
    },
    {
      href: `${BASE_PATH}/child-module-eight`,
      icon: <Globe className="w-8 h-8 text-primary-dark" />,
      title: "Child Module Eight",
      description: "Description for Child Module Eight goes here.",
    },
    {
      href: `${BASE_PATH}/child-module-nine`,
      icon: <LineChart className="w-8 h-8 text-primary-dark" />,
      title: "Child Module Nine",
      description: "Description for Child Module Nine goes here.",
    },
    {
      href: `${BASE_PATH}/child-module-ten`,
      icon: <Settings className="w-8 h-8 text-primary-dark" />,
      title: "Child Module Ten",
      description: "Description for Child Module Ten goes here.",
    },
  ];

  return (
    <ParentModule
      moduleKey="list" // update this if needed, refer to app\lib\modules\modules-directory.ts
      childModules={childModules}
      heading="Parent Module Title"
      description="This is a placeholder description for the parent module page. Customize this for your module."
    />
  );
}
