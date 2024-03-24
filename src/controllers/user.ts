import { Request, Response } from "express";
import { created, serverError, success, successAction } from "../utils/api_response";
import prisma from "../prisma_client";
import { nanoid } from "nanoid";
import { encodeOTP, generateToken } from "../utils/jwt";
import { sendMail } from "../utils/mailer";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { resendVerificationCode } from "../utils/helper";

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password: raw } = req.body;

  try {
    const otp = nanoid(6);
    const password = bcrypt.hashSync(raw, 10);

    const ver_key = encodeOTP(otp, email);

    const user = await prisma.user.create({
      data: {
        name, email, password, ver_key
      },
      select: {
        name: true,
        email: true,
        id: true,
        is_verified: true,
        created_at: true,
      }
    })

    await sendMail({
      to: email,
      subject: "Please verify your account!",
      type: "text",
      content: "Your verification code is " + otp
    })

    return created(res, user, "Please check your email for your verification code")
  } catch (error) {
    console.log(error)
    return serverError(res);
  }
}

export const verifyUserEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    await prisma.user.update({ where: { email }, data: { is_verified: true }})

    return successAction(res, "Your email was successfully verified!")
  } catch (error) {
    return serverError(res);
  }
}

export const resendOTP = async (req: Request, res: Response) => {
  const { skipped, user } = req.body;

  try {
    !skipped && await resendVerificationCode(user);

    return successAction(res);
  } catch (error) {
    return serverError(res);
  }
}

export const login = async (req: Request, res: Response) => {
  const { user } = req.body as { user: User };

  try {
    const token = generateToken({ email: user.email, id: user.id });

    return success(res, { token }, "User logged in successfully")
  } catch (error) {
    console.log(error);
    return serverError(res);
  }
}

export const forgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findFirst({ where: { email }});

    if (user) {
      const otp = nanoid(6);

      console.log(user, otp);

      const pwd_reset_key = encodeOTP(otp, email);

      await prisma.user.update({ where: { id: user.id }, data: { pwd_reset_key }})

      await sendMail({
        to: email,
        subject: "Password Reset OTP",
        type: "text",
        content: "Please use this key to reset your password: " + otp
      })
    }

    return successAction(res, "A reset otp was sent to your email")
  } catch (error) {
    return serverError(res);
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  const { password: raw, auth_user } = req.body;

  try {
    const password = bcrypt.hashSync(raw, 10);

    await prisma.user.update({ where: { email: auth_user.email, id: auth_user.id }, data: {
      pwd_reset_key: null, password
    }})
    
    return successAction(res, "Password reset successful")
  } catch (error) {
    return serverError(res);
  }
}

export const getMe = (req: Request, res: Response) => {
  return success(res, req.body.auth_user, "User details fetched successfully")
}
