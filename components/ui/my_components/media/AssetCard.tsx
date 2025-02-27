// components/ui/my_components/media/AssetCard.tsx

"use client";

import React from "react";
import Image from "next/image";
import { MediaAsset } from "@/app/lib/media/mediaService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, ExternalLink, FileText, Image as ImageIcon, Video } from "lucide-react";

interface AssetCardProps {
  asset: MediaAsset;
}

export default function AssetCard({ asset }: AssetCardProps) {
  // Get the appropriate icon based on asset type
  const getAssetIcon = () => {
    switch (asset.type) {
      case "image":
        return <ImageIcon className="h-8 w-8 text-primary-dark mb-3" />;
      case "video":
        return <Video className="h-8 w-8 text-primary-dark mb-3" />;
      case "document":
      default:
        return <FileText className="h-8 w-8 text-primary-dark mb-3" />;
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow flex flex-col h-full">
      {getAssetIcon()}
      <h3 className="text-lg font-medium mb-2 text-primary-dark">{asset.name}</h3>

      {/* ✅ Display Bunny-hosted image */}
      {asset.type === "image" && asset.url && (
        <Image 
          src={asset.url} 
          alt={asset.name} 
          width={300} 
          height={200} 
          className="rounded-md mb-4" 
        />
      )}

      <p className="text-sm text-gray-600 mb-4 flex-grow">
        {asset.metadata?.description || "No description available"}
      </p>

      <div className="space-y-2 mt-auto">
        {/* ✅ Download button */}
        <Button asChild variant="outline" className="w-full flex items-center gap-2">
          <a href={asset.url} target="_blank" rel="noopener noreferrer" className="w-full text-left">
            <Download className="h-4 w-4" />
            Download Asset
          </a>
        </Button>
      </div>
    </Card>
  );
}
