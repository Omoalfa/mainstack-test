import prisma from "../../prisma_client";
import { EPermisions } from "./contants";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL as string;
const ADMIN_PASS = process.env.ADMIN_PASS as string;
const ADMIN_NAME = process.env.ADMIN_NAME as string;


export const createSuperAdmin = async () => {
  if (!ADMIN_EMAIL || !ADMIN_NAME || !ADMIN_PASS) {
    throw new Error("Please set your super admin details in env!")
  }

  try {
    const admin = await prisma.user.findFirst({ where: { permissions: EPermisions.SUDO }, select: { name: true, password: true, email: true, id: true }});

    if (!admin) {
      await prisma.user.create({ data: {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: bcrypt.hashSync(ADMIN_PASS, 10),
        permissions: EPermisions.SUDO,
        role: "ADMIN",
        is_verified: true
      } })

      return { success: true, message: "Sudo admin created successfully!" }
    } else {
      await prisma.user.update({
        where: { id: admin.id },
        data: {
          ...(admin.name !== ADMIN_NAME && { name: ADMIN_NAME }),
          ...(admin.email !== ADMIN_EMAIL && { email: ADMIN_EMAIL }),
          ...(bcrypt.compareSync(ADMIN_PASS, admin.password) && { password: bcrypt.hashSync(ADMIN_PASS, 10) })
        }
      })

      return { success: true, message: "Sudo admin details updated!"}
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!, unable to create super admin!")
  }
}
