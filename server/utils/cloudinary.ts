
import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary';



cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
});


export const uploadToCloudinary = async (path: string, folder = "chatplanetassets") => {
    try {
      const data = await cloudinary.uploader.upload(path, { folder: folder, resource_type:"auto" });
      return  data.secure_url 
    } catch (err) {
      console.log(err);
      throw err;
    }
  };