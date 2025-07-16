import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
//fs is file system handling,it is already provided by node.js

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    //check if there is localFilePath or not
    if (!localFilePath) return null;
    //Upload file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //If file has been uploaded successfully print the success message
    console.log("File is uploaded on Cloudinary successfully!!", response.url);
    return response;
  } catch (error) {
    //if upload operation failed remove the locally saved temporary file
    fs.unlinkSync(localFilePath);
    return null;
  }
};
