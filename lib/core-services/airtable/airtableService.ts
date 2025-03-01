// app/lib/airtable.ts

import Airtable from "airtable";

// Function to get the correct base dynamically
function getAirtableBase(baseId: string) {
    return new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(baseId);
}

// ✅ Define an explicit TypeScript type for records
export interface AirtableRecord {
    id: string;
    [key: string]: any; // ✅ This allows any fields from Airtable
}

/**
 * Fetch records from an Airtable table with optional filtering
 * @param baseId - The Airtable base ID
 * @param tableName - The table name
 * @param view - The view to use (optional)
 * @param filterFn - Optional function to filter records
 * @returns Array of records
 */
export async function fetchAirtableRecords(
    baseId: string, 
    tableName: string, 
    view?: string, 
    filterFn?: (record: any) => boolean
) {
    try {
        if (!baseId || !tableName) throw new Error("❌ Missing Airtable base ID or table name!");

        const base = getAirtableBase(baseId);
        const selectOptions: any = {}; 

        if (view) selectOptions.view = view; // ✅ Ensure view selection is optional

        let records = await base(tableName).select(selectOptions).all();

        // ✅ Apply optional filtering function if provided
        if (filterFn) {
            records = records.filter(filterFn);
        }

        return records.map(record => ({
            id: record.id,
            ...record.fields,
        }));
    } catch (error) {
        console.error(`❌ Failed to fetch from ${tableName} in ${baseId}:`, error);
        throw new Error(`Error fetching records from ${tableName}`);
    }
}

/**
 * Create one or more new records in an Airtable table
 * @param baseId - The Airtable base ID
 * @param tableName - The table to insert into
 * @param records - Array of records with `fields` objects
 * @returns Created records
 */
export async function createAirtableRecord(baseId: string, tableName: string, fields: any | any[]) {
    try {
        if (!baseId || !tableName || !fields) {
            throw new Error("❌ Missing parameters for record creation!");
        }

        const base = getAirtableBase(baseId);
        const records = Array.isArray(fields) ? fields : [{ fields }];

        // ✅ Ensure we don't send any records with empty fields
        const validRecords = records.filter(record => record.fields && Object.keys(record.fields).length > 0);

        if (validRecords.length === 0) {
            throw new Error("❌ No valid records to create.");
        }

        const response = await base(tableName).create(validRecords);
        return response.map(rec => ({
            id: rec.id,
            ...rec.fields
        }));

    } catch (error) {
        console.error(`❌ Failed to create record(s) in ${tableName} (Base: ${baseId}):`, error);
        throw new Error(`Error saving record(s) in ${tableName}`);
    }
}