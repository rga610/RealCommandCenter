// app/lib/media/databaseService.ts

import { createAirtableRecord, fetchAirtableRecords } from "@/lib/core-services/airtable/airtableService";
import { MediaAsset, StorageZoneType } from "../../../types/modules/media/types";

/**
 * Describe the shape of an Airtable record for media assets.
 * We include an index signature so bracket notation is allowed.
 */
interface AirtableMediaRecord {
  "Asset ID"?: string;
  "Asset Name"?: string;
  "Storage Zone"?: string;
  "Asset Type"?: string;
  "URL"?: string;
  "Thumbnail URL"?: string;
  "Size"?: number;
  "Created At"?: string;
  "Is Public"?: boolean;
  "Path"?: string;
  "Folder"?: string;
  "Metadata"?: string;
  [key: string]: unknown; // allow any additional fields
}

const AIRTABLE_MEDIA_BASE_ID = process.env.AIRTABLE_MEDIA_BASE_ID || "";
const AIRTABLE_MEDIA_ASSETS_TABLE_ID = process.env.AIRTABLE_MEDIA_ASSETS_TABLE_ID || "";

/**
 * Save a media asset's metadata to Airtable
 */
export async function saveMediaAsset(asset: MediaAsset): Promise<string> {
  try {
    const records = await createAirtableRecord(
      AIRTABLE_MEDIA_BASE_ID,
      AIRTABLE_MEDIA_ASSETS_TABLE_ID,
      {
        "Asset ID": asset.id,
        "Asset Name": asset.name,
        "Storage Zone": asset.storageZone,
        "Asset Type": asset.type,
        "URL": asset.url,
        "Thumbnail URL": asset.thumbnailUrl,
        "Size": asset.size,
        "Created At": asset.createdAt,
        "Is Public": asset.isPublic,
        "Path": asset.path || "",
        "Folder": asset.folder || "",
        "Metadata": JSON.stringify(asset.metadata || {}),
      }
    );

    return records[0].id;
  } catch (error) {
    console.error("Error saving media asset to Airtable:", error);
    throw error;
  }
}

/**
 * Get media assets from Airtable with optional filters
 */
export async function getMediaAssets(
  filters?: {
    storageZone?: StorageZoneType;
    type?: MediaAsset["type"];
    folder?: string;
  }
): Promise<MediaAsset[]> {
  try {
    // Fetch records from Airtable and assert they match our AirtableMediaRecord shape
    const records = (await fetchAirtableRecords(
      AIRTABLE_MEDIA_BASE_ID,
      AIRTABLE_MEDIA_ASSETS_TABLE_ID
    )) as AirtableMediaRecord[];

    // Apply filters if provided
    let filteredRecords = [...records];
    if (filters) {
      if (filters.storageZone) {
        filteredRecords = filteredRecords.filter(
          (r) => r["Storage Zone"] === filters.storageZone
        );
      }
      if (filters.type) {
        filteredRecords = filteredRecords.filter(
          (r) => r["Asset Type"] === filters.type
        );
      }
      if (filters.folder) {
        filteredRecords = filteredRecords.filter(
          (r) => r["Folder"] === filters.folder
        );
      }
    }

    // Map Airtable records to MediaAsset objects with safe type handling
    return filteredRecords.map((record) => {
      // Safe accessor function to handle potentially missing fields
      const getField = (fieldName: string, defaultValue: any = ""): any => {
        return record[fieldName] !== undefined ? record[fieldName] : defaultValue;
      };

      // Parse metadata safely
      let metadata;
      try {
        const metadataStr = getField("Metadata", "{}");
        metadata = typeof metadataStr === "string" ? JSON.parse(metadataStr) : {};
      } catch (e) {
        metadata = {};
      }

      // Return properly typed MediaAsset
      return {
        id: getField("Asset ID"),
        name: getField("Asset Name"),
        storageZone: getField("Storage Zone") as StorageZoneType,
        type: getField("Asset Type") as MediaAsset["type"],
        url: getField("URL"),
        thumbnailUrl: getField("Thumbnail URL"),
        size: getField("Size", 0),
        createdAt: getField("Created At", new Date().toISOString()),
        isPublic: getField("Is Public", true),
        path: getField("Path"),
        folder: getField("Folder"),
        metadata,
      };
    });
  } catch (error) {
    console.error("Error fetching media assets from Airtable:", error);
    throw error;
  }
}

/**
 * Delete a media asset from Airtable by ID
 */
export async function deleteMediaAsset(id: string): Promise<boolean> {
  try {
    // This would be implemented with your Airtable delete function
    // For now, just return true
    console.log(`Would delete asset with ID: ${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting media asset from Airtable:", error);
    throw error;
  }
}
