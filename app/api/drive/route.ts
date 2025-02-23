import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  // 1. Get the user session (must use getServerSession for App Router).
  const session = await getServerSession(authOptions)

  // 2. If no session or missing token, return 401 Unauthorized.
  if (!session) {
    console.error("Unauthorized: No session found")
    return NextResponse.json({ error: "Unauthorized: No session found" }, { status: 401 })
  }
  if (!session.accessToken) {
    console.error("Unauthorized: No access token")
    return NextResponse.json({ error: "Unauthorized: No access token" }, { status: 401 })
  }

  // 3. Set Google OAuth credentials using the user's access token.
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: session.accessToken })

  const drive = google.drive({ version: "v3", auth })

  // 4. Search for the folder by name in your Shared Drive
  const folderName = `${session?.user?.name} - Marketing Collateral`
  console.log("Searching for folderName:", folderName)

  const folderSearch = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
    driveId: "0AKzQpwLzM_cfUk9PVA",    // The ID for your "Marketing Collateral" shared drive
    corpora: "drive",
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
    fields: "files(id, name)",
  })

  // 5. If no matching folder, return 404
  const folders = folderSearch.data.files
  if (!folders || folders.length === 0) {
    console.error("Folder not found")
    return NextResponse.json({ error: "Folder not found" }, { status: 404 })
  }

  // You found exactly one folder; get its ID
  const folderId = folders[0].id
  console.log("Found folder ID:", folderId, "Name:", folders[0].name)

  // 6. Now list the contents of that subfolder
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      driveId: "0AKzQpwLzM_cfUk9PVA",
      corpora: "drive",
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      fields: "files(id, name, webViewLink, thumbnailLink, modifiedTime, createdTime, mimeType)",
      orderBy: "modifiedTime desc",
    })

    const files = response.data.files
    if (!files || files.length === 0) {
      console.error("No files found in that folder")
      return NextResponse.json({ error: "No files found" }, { status: 404 })
    }

    // Return array of files
    return NextResponse.json(files)
  } catch (error: any) {
    console.error("Google Drive API Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
