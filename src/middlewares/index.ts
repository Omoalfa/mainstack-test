import { NextFunction, Request, Response } from "express";
import { badRequest, serverError, unAthorized } from "../utils/api_response";
import cloudinary from "../utils/cloudinary";
import { UploadedFile } from "express-fileupload";
import { decodeToken } from "../utils/jwt";
import prisma from "../prisma_client";

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return unAthorized(res, "Invalid token");
  }
  
  try {
    const token = authorization.split(" ")[1];

    const { id, email } = decodeToken(token);

    const user = await prisma.user.findFirst({ 
      where: { email, id },
      select: { name: true, id: true, email: true, created_at: true, img: true, is_verified: true }
    });

    if (!user) {
      return unAthorized(res, "Invalid token");
    }


    req.body = {
      ...req.body,
      auth_user: user
    }

    return next();
  } catch (error) {
    console.log(error)
    return unAthorized(res, "Invalid token");
  }
}

export const uploadImage = (key: string, constraint: "required" | "optional") => async (req: Request, res: Response, next: NextFunction) => {
  const file = req.files?.[key] as UploadedFile
  if (constraint === "required" && !file) {
    return badRequest(res, "", "Please upload your " + key)
  }

  try {
    if (file) {
      const result = await cloudinary.uploader.upload(file.tempFilePath);
  
      req.body[key] = result.secure_url;
    }
  
    return next()
  } catch (error) {
    serverError(res);
  }
}
