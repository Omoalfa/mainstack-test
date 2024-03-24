import validate from ".";
import prisma from "../prisma_client";

export const validateCreateProduct = validate({
  name: {
    in: ["body"],
    isString: true,
    notEmpty: true,
    custom: {
      options: async (name: string) => {

        const product = await prisma.product.findFirst({
          where: {
            name,
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


export const validateUpdateProduct = validate({
  id: {
    in: ["params"],
    isString: true,
    custom: {
      options: async (id: string, { req }) => {
        const product = await prisma.product.findFirst({
          where: { id },
          select: { id: true, name: true }
        })

        if (!product) {
          throw new Error("Product not found!")
        }
      }
    }
  },
  name: {
    in: ["body"],
    isString: true,
    notEmpty: true,
    custom: {
      options: async (name: string) => {

        const product = await prisma.product.findFirst({
          where: {
            name
          }
        })

        if (product) {
          throw new Error("This product already exists!")
        }
      }
    },
    optional: true
  },
  img: {
    in: ["body"],
    isURL: true,
    optional: true,
  },
  description: {
    in: ["body"],
    isString: true,
    notEmpty: true,
    optional: true,
  },
  price: {
    in: ["body"],
    isInt: true,
    optional: true
  }
})

export const validateGetProduct = validate({
  id: {
    in: ["params"],
    isString: true,
    custom: {
      options: async (id: string) => {
        const product = await prisma.product.findFirst({
          where: { id,  },
          select: { id: true, name: true }
        })

        if (!product) {
          throw new Error("Product not found!")
        }
      }
    }
  }
})

export const validateBuyProduct = validate({
  id: {
    in: ["params"],
    isString: true,
    notEmpty: true,
    custom: {
      options: async (id: string, { req }) => {
        const product = await prisma.product.findFirst({
          where: { id },
          select: { price: true, id: true }
        })

        if (!product) throw new Error("Product not found!")

        req.body.product = product;
      }
    }
  },
  stock: {
    in: ["body"],
    isInt: true,
    optional: true,
  }
})
