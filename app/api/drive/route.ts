import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import { auth } from "@clerk/nextjs/server"

export async function GET(req: NextRequest) {
  // 1. Verify user is signed in with Clerk
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 })
  }

  // 2. Grab your service account credentials from process.env
  const serviceEmail = process.env.GOOGLE_CLIENT_EMAIL
  const serviceKey = process.env.GOOGLE_PRIVATE_KEY
  if (!serviceEmail || !serviceKey) {
    console.error("Missing Google service account env vars")
    return NextResponse.json({ error: "Server config error" }, { status: 500 })
  }

  // 3. Initialize the Google Auth with these credentials
  const authClient = new google.auth.GoogleAuth({
    credentials: {
      client_email: serviceEmail,
      // If your private key has literal "\n" in the .env, replace them:
      private_key: serviceKey.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/drive"],
  })

  const drive = google.drive({ version: "v3", auth: authClient })

  try {
    // 4. Suppose you want a shared drive with ID
    const driveId = "YOUR_SHARED_DRIVE_ID"
    const folderName = "Roberto Guillén - Marketing Collateral"

    // Search for the folder by name
    console.log("Searching for folderName:", folderName)
    const folderSearch = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
      driveId,
      corpora: "drive",
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      fields: "files(id, name)",
    })

    const folders = folderSearch.data.files
    if (!folders || folders.length === 0) {
      console.error("Folder not found")
      return NextResponse.json({ error: "Folder not found" }, { status: 404 })
    }

    const folderId = folders[0].id
    console.log("Found folder ID:", folderId, "Name:", folders[0].name)

    // Now list the contents
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      driveId,
      corpora: "drive",
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      fields: "files(id, name, webViewLink, thumbnailLink, modifiedTime, createdTime, mimeType)",
      orderBy: "modifiedTime desc",
    })

    const files = response.data.files
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files found" }, { status: 404 })
    }

    return NextResponse.json(files)
  } catch (error: any) {
    console.error("Google Drive API Error:", error)
    return NextResponse.json(
      { error: error.message || "Drive API Error" },
      { status: 500 }
    )
  }
}
