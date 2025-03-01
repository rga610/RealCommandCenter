
export type StorageZoneType = 'marketing-media' | 'listing-media' | 'branding-assets' | 'ui-assets' | 'archived-media';
export type AssetType = 'image' | 'video' | 'document' | 'other';

export interface MediaAsset {
  id: string;          // Usually file name or unique ID
  name: string;        // Display name
  storageZone: StorageZoneType;
  type: AssetType;     // File type (image, video, document, etc)
  url: string;         // Full URL to access the file
  thumbnailUrl: string; // URL for thumbnail (same as URL for non-images)
  size: number;        // File size in bytes
  createdAt: string;   // ISO timestamp
  updatedAt?: string;  // ISO timestamp (optional)
  isPublic: boolean;   // Whether the asset is publicly accessible
  metadata?: Record<string, any>; // Optional metadata
  path?: string;       // Path within storage zone
  folder?: string;     // Parent folder name
}

export interface MediaUploadOptions {
  file: File;
  fileName?: string;   // Optional custom filename
  folder?: string;     // Target folder
  storageZone: StorageZoneType;
  isPublic?: boolean;
  metadata?: Record<string, any>;
}

export interface TransformationOptions {
  width?: number;
  height?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  quality?: number;
  crop?: boolean;
  fit?: 'cover' | 'contain' | 'fill';
}

export interface BunnyStorageFile {
  Guid: string;
  StorageZoneName: string;
  Path: string;
  ObjectName: string;
  Length: number;
  LastChanged: string;
  ServerId: string;
  ArrayNumber: number;
  IsDirectory: boolean;
  UserId: string;
  ContentType: string;
  DateCreated: string;
  StorageZoneId: number;
  Checksum: string;
}