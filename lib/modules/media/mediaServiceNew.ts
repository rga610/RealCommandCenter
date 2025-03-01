// app/lib/media/mediaServiceNew.ts

import { MediaAsset, MediaUploadOptions, StorageZoneType, TransformationOptions } from '../../../types/modules/media/types';
import * as storageService from './storageService';
//import * as transformationService from './transformationService';
import * as databaseService from './databaseService';

/**
 * List all assets from a storage zone/folder
 */
export async function listAssets(
  storageZone: StorageZoneType,
  folder: string = ""
): Promise<MediaAsset[]> {
  try {
    // Get assets directly from Bunny
    return await storageService.listFiles(storageZone, folder);
  } catch (error) {
    console.error(`Error listing assets from ${storageZone}/${folder}:`, error);
    throw error;
  }
}

/**
 * Upload a new asset
 */
export async function uploadAsset(options: MediaUploadOptions): Promise<MediaAsset> {
  try {
    // 1. Upload file to Bunny.net
    const asset = await storageService.uploadFile(options);
    
    // 2. Save metadata to Airtable
    await databaseService.saveMediaAsset(asset);
    
    return asset;
  } catch (error) {
    console.error('Error uploading asset:', error);
    throw error;
  }
}

/**
 * Get a single asset by path
 */
//export async function getAsset(
  //storageZone: StorageZoneType,
  //path: string
//): Promise<MediaAsset | null> {
  //try {
    //return await storageService.getFile(storageZone, path);
  //} catch (error) {
    //console.error(`Error getting asset ${storageZone}/${path}:`, error);
    //throw error;
  //}
//}

/**
 * Delete an asset
 */
export async function deleteAsset(
  storageZone: StorageZoneType,
  path: string
): Promise<boolean> {
  try {
    // 1. Delete from Bunny.net
    const deleted = await storageService.deleteFile(storageZone, path);
    
    if (deleted) {
      // 2. Remove from Airtable (if we're tracking it)
      try {
        await databaseService.deleteMediaAsset(path);
      } catch (dbError) {
        console.warn(`File deleted from storage but error removing from database: ${dbError}`);
      }
    }
    
    return deleted;
  } catch (error) {
    console.error(`Error deleting asset ${storageZone}/${path}:`, error);
    throw error;
  }
}

/**
 * Transform an image
 */
//export async function transformImage(
  //imageUrl: string,
  //options: TransformationOptions
//): Promise<string> {
  //try {
    //return await transformationService.transformImage(imageUrl, options);
  //} catch (error) {
    //console.error('Error transforming image:', error);
    //throw error;
  //}
//}

/**
 * Get marketing assets from the marketing-media zone
 */
export async function getMarketingAssets(folder: string = ""): Promise<MediaAsset[]> {
  return await listAssets('marketing-media', folder);
}

/**
 * Get listing assets from the listing-media zone
 */
export async function getListingAssets(folder: string = ""): Promise<MediaAsset[]> {
  return await listAssets('listing-media', folder);
}

/**
 * Get branding assets from the branding-assets zone
 */
export async function getBrandingAssets(folder: string = ""): Promise<MediaAsset[]> {
  return await listAssets('branding-assets', folder);
}

/**
 * Get UI assets from the ui-assets zone
 */
export async function getUIAssets(folder: string = ""): Promise<MediaAsset[]> {
  return await listAssets('ui-assets', folder);
}