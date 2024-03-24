import validate from ".";
import prisma from "../prisma_client";

export const validateGetOrderDetails = (type: "admin" | "user") => validate({
  id: {
    in: ["params"],
    isString: true,
    notEmpty: true,
    custom: {
      options: async (id: string, { req }) => {
        const { auth_user } = req.body;
        
        const order = await prisma.order.findFirst({
          where: { ...(type === "user" && { user_id: auth_user.id }), id },
          select: { id: true, user: true, created_at: true, status: true, product: true, refrence_id: true, payment_link: true, stock: true, amount: true  },
        })

        if (!order) {
          throw new Error("Order not found!")
        }

        req.body.order = order
      }
    }
  }
})
