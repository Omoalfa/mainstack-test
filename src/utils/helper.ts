import { nanoid } from "nanoid";
import prisma from "../prisma_client";
import { encodeOTP } from "./jwt";
import { sendMail } from "./mailer";

export const resendVerificationCode = async (user: any) => {
  try {
    const otp = nanoid(6);
    const ver_key = encodeOTP(otp, user.email);

    console.log(otp);

    await prisma.user.update({
      where: { id: user.id },
      data: { ver_key, is_verified: false }
    });

    await sendMail({
      to: user.email,
      content: "Your verification code is " + otp,
      type: "text",
      subject: "Please verify you account"
    })
  } catch (error) {
    console.log(error);
  }
}
