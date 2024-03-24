import { Request, Response } from "express";
import { created, serverError, success, successAction, successPaginated } from "../utils/api_response";
import prisma from "../prisma_client";
import { PaginatedQueryParam } from "../interface";
import { Product, User } from "@prisma/client";
import { nanoid } from "nanoid";
import Paystack from "../utils/paystack";


export const createProduct = async (req: Request, res: Response) => {
  const { name, price, description, img } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name, price: Number(price) * 100, description, img
      },
      select: {
        id: true, name: true, price: true, description: true, img: true,
      }
    })

    return created(res, product, "Your product was created successfully!")
  } catch (error) {
    console.log(error)
    return serverError(res);
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  const { name, price, description, img } = req.body;
  const { id } = req.params;

  try {
    await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(price && { price }),
        ...(img && { img }),
        ...(description && { description }),
      }
    })

    return successAction(res, "Product details updated successfully!")
  } catch (error) {
    return serverError(res);
  }
}

export const getOneProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        img: true,
        price: true,
      },
    })

    return success(res, product, "Product details fetched successfully!")
  } catch (error) {
    return serverError(res);
  }
}

export const getAllProducts = async (req: Request, res: Response) => {
  const { page = 1, limit = 20 } = req.query as any as PaginatedQueryParam;

  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        img: true,
        price: true,
      },
      orderBy: { price: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.product.count();

    return successPaginated(res, {
      total,
      limit,
      page,
      list: products
    })
  } catch (error) {
    return serverError(res);
  }
}

export const buyProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { auth_user, product, stock = 1 } = req.body as { auth_user: User, product: Product, stock: number };

  try {
    const refrence_id = nanoid(10);
    const paystack = new Paystack();

    const result = await paystack.createCharge({ reference: refrence_id, amount: product.price * stock, email: auth_user.email })

    const order = await prisma.order.create({
      data: {
        product_id: id,
        user_id: auth_user.id,
        amount: product.price * stock,
        refrence_id,
        stock,
        payment_link: result.authorization_url
      }
    })

    return created(res, order, "Your order was created successfully please make payment immediately")
  } catch (error) {
    return serverError(res);
  }
}
