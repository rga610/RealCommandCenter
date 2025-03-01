// components/ui/my_components/media/AssetGrid.tsx
"use client";

import React from 'react';
import { MediaAsset } from '@/lib/media/types';
import AssetCard from '../../../modules/media/AssetCard';

interface AssetGridProps {
  assets: MediaAsset[];
  onDelete?: (asset: MediaAsset) => void;
  emptyMessage?: string;
}

export default function AssetGrid({ 
  assets, 
  onDelete,
  emptyMessage = "No assets found."
}: AssetGridProps) {
  if (assets.length === 0) {
    return <p className="text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {assets.map((asset) => (
        <AssetCard 
          key={asset.id} 
          asset={asset}
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}