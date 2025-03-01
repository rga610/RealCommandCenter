// app/lib/media/storageService.ts

import { MediaAsset, BunnyStorageFile, StorageZoneType, MediaUploadOptions } from '../../../types/modules/media/types';
import config, { getStorageZoneConfig } from './config';

/**
 * Lists files from a specific folder in a Bunny.net storage zone
 */
export async function listFiles(
  storageZone: StorageZoneType,
  folder: string = ""
): Promise<MediaAsset[]> {
  const zoneConfig = getStorageZoneConfig(storageZone);
  const folderPath = folder ? `${folder}/` : "";
  
  // Build the Bunny Storage API URL
  const url = `https://storage.bunnycdn.com/${zoneConfig.name}/${folderPath}`;
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        AccessKey: zoneConfig.password,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list files from Bunny. Status: ${response.status}`);
    }

    const files: BunnyStorageFile[] = await response.json();
    
    return files
      .filter(file => !file.IsDirectory)
      .map(file => mapBunnyFileToMediaAsset(file, storageZone, folder));
  } catch (error) {
    console.error(`Error listing files from ${storageZone}/${folder}:`, error);
    throw error;
  }
}

/**
 * Gets a single file from Bunny.net
 */
export async function getFile(
  storageZone: StorageZoneType,
  path: string
): Promise<MediaAsset | null> {
  const zoneConfig = getStorageZoneConfig(storageZone);
  const url = `https://storage.bunnycdn.com/${zoneConfig.name}/${path}`;
  
  try {
    // First check if the file exists and get its metadata
    const response = await fetch(url, {
      method: "GET",
      headers: {
        AccessKey: zoneConfig.password,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to get file from Bunny. Status: ${response.status}`);
    }

    // Get file info
    const contentLength = response.headers.get('Content-Length') || '0';
    const contentType = response.headers.get('Content-Type') || '';
    const lastModified = response.headers.get('Last-Modified') || new Date().toISOString();
    
    // Extract folder and filename
    const pathParts = path.split('/');
    const fileName = pathParts.pop() || path;
    const folder = pathParts.join('/');
    
    // Build media asset
    return {
      id: path,
      name: fileName,
      storageZone,
      type: guessFileType(fileName),
      url: `${zoneConfig.cdnUrl}/${path}`,
      thumbnailUrl: `${zoneConfig.cdnUrl}/${path}`,
      size: parseInt(contentLength),
      createdAt: lastModified,
      isPublic: true,
      path,
      folder,
    };
  } catch (error) {
    console.error(`Error getting file ${storageZone}/${path}:`, error);
    throw error;
  }
}

/**
 * Uploads a file to Bunny.net
 */
export async function uploadFile(options: MediaUploadOptions): Promise<MediaAsset> {
  const { file, fileName, folder, storageZone, isPublic = true, metadata } = options;
  const zoneConfig = getStorageZoneConfig(storageZone);
  
  // Use provided fileName or original file name
  const finalFileName = fileName || file.name;
  
  // Build path with or without folder
  const filePath = folder ? `${folder}/${finalFileName}` : finalFileName;
  const url = `https://storage.bunnycdn.com/${zoneConfig.name}/${filePath}`;
  
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        AccessKey: zoneConfig.password,
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file to Bunny. Status: ${response.status}`);
    }

    // Return the media asset
    return {
      id: filePath,
      name: finalFileName,
      storageZone,
      type: guessFileType(finalFileName),
      url: `${zoneConfig.cdnUrl}/${filePath}`,
      thumbnailUrl: `${zoneConfig.cdnUrl}/${filePath}`,
      size: file.size,
      createdAt: new Date().toISOString(),
      isPublic,
      metadata,
      path: filePath,
      folder: folder || '',
    };
  } catch (error) {
    console.error(`Error uploading file to ${storageZone}/${filePath}:`, error);
    throw error;
  }
}

/**
 * Deletes a file from Bunny.net
 */
export async function deleteFile(storageZone: StorageZoneType, path: string): Promise<boolean> {
  const zoneConfig = getStorageZoneConfig(storageZone);
  const url = `https://storage.bunnycdn.com/${zoneConfig.name}/${path}`;
  
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        AccessKey: zoneConfig.password,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete file from Bunny. Status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting file ${storageZone}/${path}:`, error);
    throw error;
  }
}

/**
 * Helper function to map Bunny file object to MediaAsset
 */
function mapBunnyFileToMediaAsset(
  file: BunnyStorageFile,
  storageZone: StorageZoneType,
  folder: string = ""
): MediaAsset {
  const zoneConfig = getStorageZoneConfig(storageZone);
  const fileName = file.ObjectName;
  const filePath = folder ? `${folder}/${fileName}` : fileName;
  
  return {
    id: filePath,
    name: fileName,
    storageZone,
    type: guessFileType(fileName),
    url: `${zoneConfig.cdnUrl}/${filePath}`,
    thumbnailUrl: `${zoneConfig.cdnUrl}/${filePath}`,
    size: file.Length,
    createdAt: file.LastChanged,
    isPublic: true,
    path: filePath,
    folder,
  };
}

/**
 * Utility: guess file type by extension
 */
export function guessFileType(fileName: string): MediaAsset["type"] {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return "image";
  if (["mp4", "mov", "wmv", "avi", "webm"].includes(ext)) return "video";
  if (["pdf", "doc", "docx", "ppt", "pptx", "zip", "xlsx", "xls", "csv"].includes(ext)) return "document";
  return "other";
}