import { NextFunction, Request, Response } from "express";
import { badRequest, notAllowed, serverError, unAthorized } from "../utils/api_response";
import cloudinary from "../utils/cloudinary";
import { UploadedFile } from "express-fileupload";
import { decodeToken } from "../utils/jwt";
import prisma from "../prisma_client";
import { EPermisions, permission_divider } from "../utils/admin/contants";
import { minimatch } from "minimatch";
import { User } from "@prisma/client";
import crypto from "crypto";

const PAYSTACK_KEY = process.env.PAYSTACK_KEY as string;

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
      select: { name: true, id: true, email: true, created_at: true, img: true, is_verified: true, role: true, permissions: true }
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

export const isAdmin = (permission?: EPermisions) => (req: Request, res: Response, next: NextFunction) => {
  const { auth_user } = req.body as { auth_user: User };

  if (auth_user.role !== "ADMIN") {
    return notAllowed(res, "Access denied", "You are not allowed to access this resource")
  }

  if (permission) {
    if (auth_user.permissions) {
      const user_permissions = auth_user.permissions.split(permission_divider) as EPermisions[];

      let allowed = false;

      for (let up of user_permissions) {
        if (minimatch(permission, up)) {
          allowed = true;
          break;
        }
        continue;
      }

      if (!allowed) {
        return notAllowed(res, "Access denied", "You don't have permission to access this resource")
      }
    } else {
      return notAllowed(res, "Access denied", "You don't have the permission to access this resource")
    }
  }

  return next();
}

export const validatePaystack = (req: Request, res: Response, next: NextFunction) => {
  //validate event
  const hash = crypto.createHmac('sha512', PAYSTACK_KEY).update(JSON.stringify(req.body)).digest('hex');
  if (hash == req.headers['x-paystack-signature']) {
    return next()
  }
  return unAthorized(res, null);
}
