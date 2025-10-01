import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

// Upload image to Cloudinary
export async function uploadImage(
  file: Buffer,
  folder: string = 'walnut_leathers/images',
  options: any = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder,
        transformation: [
          { width: 800, height: 800, crop: 'limit', quality: 'auto' },
          { format: 'auto' }
        ],
        ...options
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else if (result?.secure_url) {
          resolve(result.secure_url)
        } else {
          reject(new Error('No secure URL returned from Cloudinary'))
        }
      }
    ).end(file)
  })
}

// Upload video to Cloudinary
export async function uploadVideo(
  file: Buffer,
  folder: string = 'walnut_leathers/videos',
  options: any = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder,
        transformation: [
          { width: 800, height: 600, crop: 'limit', quality: 'auto' }
        ],
        ...options
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else if (result?.secure_url) {
          resolve(result.secure_url)
        } else {
          reject(new Error('No secure URL returned from Cloudinary'))
        }
      }
    ).end(file)
  })
}

// Delete image from Cloudinary
export async function deleteImage(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

// Delete video from Cloudinary
export async function deleteVideo(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, { resource_type: 'video' }, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

// Get optimized image URL
export function getOptimizedImageUrl(
  publicId: string,
  width?: number,
  height?: number,
  quality: string = 'auto'
): string {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'limit',
    quality,
    format: 'auto'
  })
}

// Get optimized video URL
export function getOptimizedVideoUrl(
  publicId: string,
  width?: number,
  height?: number,
  quality: string = 'auto'
): string {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    width,
    height,
    crop: 'limit',
    quality
  })
}
