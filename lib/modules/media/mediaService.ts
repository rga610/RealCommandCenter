// app/lib/media/mediaService.ts

import { v4 as uuidv4 } from "uuid";

// Types for media assets
export interface MediaAsset {
  id: string;
  name: string;
  storageZone: string; // e.g. 'marketing-media'
  type: "image" | "video" | "document" | "other";
  url: string;
  thumbnailUrl: string;
  size: number;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, any>;
  isPublic: boolean;
  agentId?: string;
  listingId?: string;
}

// Configuration for Bunny
const config = {
  apiKey: process.env.BUNNY_API_KEY || "",
  // Each storage zone + password
  storageZones: {
    marketingMedia: {
      name: "marketing-media",
      password: process.env.BUNNY_STORAGE_MARKETING_MEDIA_PASSWORD || "",
    },
    listingMedia: {
      name: "listing-media",
      password: process.env.BUNNY_STORAGE_LISTING_MEDIA_PASSWORD || "",
    },
    brandingAssets: {
      name: "branding-assets",
      password: process.env.BUNNY_STORAGE_BRANDING_ASSETS_PASSWORD || "",
    },
    uiAssets: {
      name: "ui-assets",
      password: process.env.BUNNY_STORAGE_UI_ASSETS_PASSWORD || "",
    },
    archivedMedia: {
      name: "archived-media",
      password: process.env.BUNNY_BUNNY_STORAGE_ARCHIVED_MEDIA_PASSWORD || "",
    },
  },
  // Separate pull zone (CDN) URLs for each storage zone
  cdnUrls: {
    marketingMedia: "https://marketing-media.b-cdn.net",
    listingMedia: "https://listing-media.b-cdn.net",
    brandingAssets: "https://branding-assets.b-cdn.net",
    uiAssets: "https://ui-assets.b-cdn.net",
    archivedMedia: "https://archived-media.b-cdn.net",
  },
};

// --------------------------------------------------
// MARKETING ASSETS
// Fetch real files from the "marketing-media" zone
// --------------------------------------------------
export async function getMarketingAssets(folder: string): Promise<MediaAsset[]> {
  // e.g. list all files in the "marketing" folder
  // If you want the root, remove "marketing/" from the path
  const folderPath = folder || "marketing"; 
  const storageName = config.storageZones.marketingMedia.name;
  const accessKey = config.storageZones.marketingMedia.password;

  // 1) Construct the Bunny Storage API endpoint
  const bunnyUrl = `https://storage.bunnycdn.com/${storageName}/${folderPath}/`;

  // 2) Fetch the folder listing from Bunny
  const response = await fetch(bunnyUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      AccessKey: accessKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to list marketing files. Status: ${response.status}`);
  }

  // 3) Parse JSON array of file objects
  const files = await response.json();

  // 4) Convert to MediaAsset objects
  const assets: MediaAsset[] = files
    .filter((file: any) => !file.IsDirectory)
    .map((file: any) => {
      const fileName = file.ObjectName; // e.g. "pitch-deck.pdf"
      const cdnUrl = config.cdnUrls.marketingMedia; // use marketing pull zone
      const fullUrl = `${cdnUrl}/${folderPath}/${fileName}`;
      return {
        id: fileName,
        name: fileName,
        storageZone: "marketing-media",
        type: guessFileType(fileName),
        url: fullUrl,
        thumbnailUrl: fullUrl,
        size: file.Length,
        createdAt: file.LastChanged,
        isPublic: true,
      };
    });

  return assets;
}

// --------------------------------------------------
// LISTING MEDIA (Tests folder) from the "listing-media" zone
// --------------------------------------------------
export async function getListingMedia(folder: string): Promise<MediaAsset[]> {
  const folderPath = folder || "Tests"; // The folder you want to read
  const storageName = config.storageZones.listingMedia.name;
  const accessKey = config.storageZones.listingMedia.password;

  // 1) Construct Bunny Storage API endpoint for that folder
  //    e.g. https://storage.bunnycdn.com/listing-media/Tests/
  const bunnyUrl = `https://storage.bunnycdn.com/${storageName}/${folderPath}/`;

  // 2) Make GET request to Bunny to list files in that folder
  const response = await fetch(bunnyUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      AccessKey: accessKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to list files from Bunny. Status: ${response.status}`);
  }

  // 3) The response is typically an array of file objects
  const files = await response.json();

  // 4) Filter out directories and map to MediaAsset
  const assets: MediaAsset[] = files
    .filter((file: any) => !file.IsDirectory)
    .map((file: any) => {
      const fileName = file.ObjectName;
      const cdnUrl = config.cdnUrls.listingMedia; // use listing pull zone
      const fullUrl = `${cdnUrl}/${folderPath}/${fileName}`;
      return {
        id: fileName,
        name: fileName,
        storageZone: "listing-media",
        type: guessFileType(fileName),
        url: fullUrl,
        thumbnailUrl: fullUrl,
        size: file.Length,
        createdAt: file.LastChanged,
        isPublic: true,
      };
    });

  return assets;
}

// Utility: guess file type by extension
function guessFileType(fileName: string): MediaAsset["type"] {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "image";
  if (["mp4", "mov", "wmv"].includes(ext)) return "video";
  if (["pdf", "doc", "docx", "ppt", "pptx", "zip"].includes(ext)) return "document";
  return "other";
}
