import validate from ".";
import prisma from "../prisma_client";
import { resendVerificationCode } from "../utils/helper";
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
          console.log(c_password, req.body.password)
          throw new Error("Mismatch password!")
        }

        return true;
      }
    }
  },
})

export const verifyResendOTP = validate({
  email: {
    in: ["query"],
    isEmail: true,
    custom: {
      options: async (email: string, { req }) => {
        const user = await prisma.user.findFirst({
          where: { email },
          select: { email: true, id: true, is_verified: true }
        })

        console.log(user);

        if (!user) {
          req.body.skipped = true;
        } else {
          req.body.user = user;
        }
      }
    }
  }
})

export const verifyUserValidation = validate({
  email: {
    in: ["body"],
    isEmail: true,
    custom: {
      options: async (email: string) => {
        const user = await prisma.user.findFirst({
          where: { email, is_verified: true }
        })

        if (user) {
          throw new Error("User not found!")
        }
      }
    }
  },
  otp: {
    in: ["body"],
    isString: true,
    custom: {
      options: async (otp: string, { req }) => {
        const user = await prisma.user.findFirst({
          where: { email: req.body.email },
          select: { email: true, id: true, password: true, is_verified: true, ver_key: true }
        })

        if (user && !user.is_verified && user.ver_key) {
          const { code, exp } = decodeOTP(user.ver_key);

          if (new Date() > new Date(exp * 1000)) {
            throw new Error("OTP expired")
          } else if (code !== otp) {
            throw new Error("Invalid Otp")
          } else {
            return true;
          }
        } else {
          throw new Error("Invalid otp!")
        }
      }
    }
  },
})

export const loginUserValidation = validate({
  email: {
    in: ["body"],
    isEmail: true,
    custom: {
      options: async (email: string) => {
        const user = await prisma.user.findFirst({
          where: { email, is_verified: true }
        })

        if (!user) {
          throw new Error("User not found")
        }
      }
    }
  },
  password: {
    in: ["body"],
    isString: true,
    isStrongPassword: true,
    custom: {
      options: async (password: string, { req }) => {
        const user = await prisma.user.findFirst({
          where: { email: req.body.email },
          select: { email: true, id: true, password: true, is_verified: true, ver_key: true }
        })

        if (user && bcrypt.compareSync(password, user.password) && user.is_verified) {
          req.body.user = user;
          return true;
        }

        if (user && !user.is_verified && user.ver_key) {
          const { code, exp } = decodeOTP(user.ver_key);

          if (new Date() > new Date(exp * 1000)) {
            resendVerificationCode(user);
          }
        }

        throw new Error("Incorrect password or not verified account!");
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
            throw new Error("Invalid password reset otp")
          }
  
          const { code, exp } = decodeOTP(user.pwd_reset_key);
  
          if (code !== req.body.otp) {
            throw new Error("Invlaid password reset otp")
          }

          if (new Date() > new Date(exp * 1000)) {
            throw new Error("Otp expired!")
          }

  
          req.body.auth_user = user;
        }
      }
    },
    otp: {
      in: ["body"],
      isString: true,
      custom: {
        options: async (otp: string, { req }) => {
          const user = await prisma.user.findFirst({
            where: { email: req.body.email },
            select: { email: true, pwd_reset_key: true }
          })

          if (user && user.pwd_reset_key) {
            const { code, exp } = decodeOTP(user.pwd_reset_key);

            if (new Date() > new Date(exp * 1000)) {
              throw new Error("OTP expired")
            } else if (code !== otp) {
              throw new Error("Invalid Otp")
            } else {
              return true;
            }
          } else {
            throw new Error("Invalid Otp")
          }
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
