// components/ui/my_components/media/ListingMedia.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/default/card";
import { MediaAsset } from "@/lib/media/mediaService";
import AssetCard from "../../../modules/media/AssetCard";

export default function ListingMedia() {
  const [listingAssets, setListingAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListingMedia() {
      try {
        setLoading(true);
        const response = await fetch("/api/media/listing-media");
        if (!response.ok) throw new Error("Failed to fetch listing assets");
        const data = await response.json();
        setListingAssets(data.assets || []);
      } catch (err: any) {
        console.error("Error fetching listing assets:", err);
        setError("Could not load your listing assets. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchListingMedia();
  }, []);

  if (error) {
    return <div className="text-red-500 mb-4">{error}</div>;
  }

  return (
    <div className="mt-8 pt-6 border-t">
      <h2 className="text-xl font-serif text-primary-dark mb-4">Your Listing Assets</h2>
      {loading ? (
        <p className="text-gray-600">Loading your listing assets...</p>
      ) : listingAssets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listingAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        <Card className="p-6">
          <p className="text-gray-600">You don&apos;t have any listing assets yet.</p>
        </Card>
      )}
    </div>
  );
}
