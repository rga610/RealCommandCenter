// app/lib/media/config.ts

import { StorageZoneType } from '../../../types/modules/media/types';

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
      password: process.env.BUNNY_STORAGE_ARCHIVED_MEDIA_PASSWORD || "",
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
  // Cloudinary configuration
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
};

// Helper to convert from storage zone type to config keys
export function getStorageZoneConfig(zone: StorageZoneType) {
  const mapping: Record<StorageZoneType, keyof typeof config.storageZones> = {
    'marketing-media': 'marketingMedia',
    'listing-media': 'listingMedia',
    'branding-assets': 'brandingAssets',
    'ui-assets': 'uiAssets',
    'archived-media': 'archivedMedia',
  };
  
  return {
    name: config.storageZones[mapping[zone]].name,
    password: config.storageZones[mapping[zone]].password,
    cdnUrl: config.cdnUrls[mapping[zone]],
  };
}

export default config;