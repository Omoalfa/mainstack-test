import validate from ".";
import prisma from "../prisma_client";

const valdateCreateProduct = validate({
  name: {
    in: ["body"],
    isString: true,
    notEmpty: true,
    custom: {
      options: async (name: string, { req }) => {
        const { auth_user } = req.body;

        const product = await prisma.product.findFirst({
          where: {
            name,
            owner_id: auth_user.id
          }
        })

        if (product) {
          throw new Error("This product already exists!")
        }
      }
    }
  },
  img: {
    in: ["body"],
    isURL: true,
  },
  description: {
    in: ["body"],
    isString: true,
    notEmpty: true,
  },
  price: {
    in: ["body"],
    isInt: true,
  }
})
