import { Request, Response } from "express";
import { serverError, success, successPaginated } from "../utils/api_response";
import prisma from "../prisma_client";
import { PaginatedQueryParam } from "../interface";

export const getOrders = (type: "admin" | "user") => async (req: Request, res: Response) => {
  const { auth_user } = req.body;
  const { page = 1, limit = 20 } = req.query as any as PaginatedQueryParam

  try {
    const list = await prisma.order.findMany({
      where: { ...(type === "user" && { user_id: auth_user.id }) },
      select: { id: true, user: true, created_at: true, status: true, product: true, amount: true },
      orderBy: { created_at: "desc" },
      take: limit,
      skip: (page - 1) * limit
    })

    const total = await prisma.order.count({
      where: { ...(type === "user" && { user_id: auth_user.id }) }
    })

    return successPaginated(res, {
      list, page, limit, total
    }, "Orders fetched successfully")
  } catch (error) {
    return serverError(res);
  }
}

export const getOrderDetails = async (req: Request, res: Response) => {
  const { order } = req.body;

  return success(res, order, "Order details fetched successfully")
}
