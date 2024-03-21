import validate from ".";
import prisma from "../prisma_client";
import { decodeOTP } from "../utils/jwt";
import bcrypt from "bcryptjs";

export const createUserValidation = validate({
  email: {
    in: ["body"],
    isEmail: true,
    custom: {
      options: async (email: string) => {
        const user = await prisma.user.findFirst({
          where: { email }
        })

        if (user) {
          throw new Error("User already email already in use")
        }
      }
    }
  },
  name: {
    in: ["body"],
    isString: true,
    notEmpty: true
  },
  password: {
    in: ["body"],
    isString: true,
    isStrongPassword: true,
  },
  c_password: {
    in: ["body"],
    isString: true,
    isStrongPassword: true,
    custom: {
      options: (c_password: string, { req }) => {
        if (c_password !== req.body.password) {
          throw new Error("Mismatch password!")
        }
      }
    }
  },
})

export const validateResetPassword = (type: "old" | "forget") => validate({
  ...(type === "forget" && {
    email: {
      in: ["body"],
      isEmail: true,
      custom: {
        options: async (email: string, { req }) => {
          const user = await prisma.user.findFirst({
            where: { email },
            select: { id: true, pwd_reset_key: true, email: true, name: true, img: true, is_verified: true, }
          })
  
          if (!user) {
            throw new Error("User does not exist!")
          }
  
          if (!user.pwd_reset_key) {
            throw new Error("Invalid password reset token")
          }
  
          const { code, exp } = decodeOTP(user.pwd_reset_key);
  
          if (new Date() > new Date(exp * 1000)) {
            throw new Error("Otp expired!")
          }
  
          req.body.auth_user = user;
        }
      }
    }
  }),
  password: {
    in: ["body"],
    isString: true,
    isStrongPassword: true,
  },
  ...(type === "old" && {
    old_password: {
      in: ["body"],
      isString: true,
      isStrongPassword: true,
      custom: {
        options: async (old_password, { req }) => {
          const auth_user = req.body.auth_user;

          const user = await prisma.user.findFirst({ where: { id: auth_user.id }, select: { password: true }})

          if (!user || !bcrypt.compareSync(old_password, user.password)) {
            throw new Error("Wrong old password!")
          }
        }
      }
    },
  })
})
