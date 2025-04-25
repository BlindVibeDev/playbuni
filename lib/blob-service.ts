import { put, del } from "@vercel/blob"

export async function uploadImage(
  file: File | Blob | ArrayBuffer | Buffer,
  filename: string,
  folder = "personas",
): Promise<string> {
  try {
    // If BLOB_READ_WRITE_TOKEN is not available, return a placeholder
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn("BLOB_READ_WRITE_TOKEN not available, using placeholder image")
      return `https://via.placeholder.com/512x512/CCCCCC/000000?text=${encodeURIComponent(filename)}`
    }

    // Create a path with folder structure
    const path = `${folder}/${filename}`

    console.log(`Uploading image to Vercel Blob: ${path}`)

    // Upload to Vercel Blob
    const blob = await put(path, file, {
      access: "public",
      contentType: "image/png", // Set content type explicitly for Grok images
    })

    console.log(`Successfully uploaded to Vercel Blob: ${blob.url}`)
    return blob.url
  } catch (error) {
    console.error("Error uploading to blob store:", error)
    // Return a placeholder image as fallback
    return `https://via.placeholder.com/512x512/CCCCCC/000000?text=${encodeURIComponent(filename)}`
  }
}

export async function deleteImage(url: string): Promise<void> {
  try {
    // Skip deletion for placeholder images
    if (url.includes("placeholder.com")) {
      return
    }

    await del(url)
  } catch (error) {
    console.error("Error deleting from blob store:", error)
    throw error
  }
}
