// components/ui/my_components/media/AssetCard.tsx
"use client";

import React from 'react';
import { MediaAsset } from '@/lib/media/types';
import { Card } from '@/components/default/card';
import { Button } from '@/components/default/button';
import { Download, FileText, Image as ImageIcon, Video, Trash2 } from 'lucide-react';

interface AssetCardProps {
  asset: MediaAsset;
  onDelete?: (asset: MediaAsset) => void;
}

export default function AssetCard({ asset, onDelete }: AssetCardProps) {
  const getAssetIcon = () => {
    switch (asset.type) {
      case 'image':
        return <ImageIcon className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'document':
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="aspect-square bg-gray-100 rounded-md mb-4 overflow-hidden">
        {asset.type === 'image' ? (
          <img 
            src={asset.thumbnailUrl} 
            alt={asset.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {getAssetIcon()}
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <h3 className="font-medium text-lg mb-1 truncate">{asset.name}</h3>
        <p className="text-xs text-gray-500 mb-2">{formatFileSize(asset.size)}</p>
      </div>
      
      <div className="space-y-2 mt-2">
        <Button variant="outline" className="w-full">
          <a 
            href={asset.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </a>
        </Button>
        
        {onDelete && (
          <Button 
            variant="outline" 
            className="w-full text-red-500 border-red-200 hover:bg-red-50"
            onClick={() => onDelete(asset)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
      </div>
    </Card>
  );
}