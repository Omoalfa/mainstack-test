import { Request, Response } from "express";
import { created, serverError, success, successAction, successPaginated } from "../utils/api_response";
import prisma from "../prisma_client";
import { PaginatedQueryParam } from "../interface";


export const createProduct = async (req: Request, res: Response) => {
  const { name, auth_user, price, description, img } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name, owner_id: auth_user.id, price, description, img
      },
      select: {
        id: true, name: true, price: true, description: true, img: true,
      }
    })

    return created(res, product, "Your product was created successfully!")
  } catch (error) {
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
        owner: true,
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
        owner: true,
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
