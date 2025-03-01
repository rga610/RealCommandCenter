// components/ui/my_components/media/MarketingAssets.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/default/card";
import { MediaAsset } from "@/lib/media/mediaService";
import AssetCard from "../../../modules/media/AssetCard";

export default function MarketingAssets() {
  const [marketingAssets, setMarketingAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMarketingAssets() {
      try {
        setLoading(true);
        const response = await fetch("/api/media/marketing-assets");
        if (!response.ok) throw new Error("Failed to fetch marketing assets");
        const data = await response.json();
        setMarketingAssets(data.assets || []);
      } catch (err: any) {
        console.error("Error fetching marketing assets:", err);
        setError("Could not load marketing assets. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchMarketingAssets();
  }, []);

  if (error) {
    return <div className="text-red-500 mb-4">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-serif text-primary-dark mb-4">Marketing Materials</h2>
      {loading ? (
        <p className="text-gray-600">Loading marketing assets...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketingAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  );
}
