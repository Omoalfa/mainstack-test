import { v2 as cloudinary } from "cloudinary";
const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME as string;
const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY as string;
const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET as string;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET
})

export default cloudinary;
