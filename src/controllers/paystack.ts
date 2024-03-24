import { Request, Response } from "express";
import { serverError, successAction } from "../utils/api_response";
import prisma from "../prisma_client";



const chargeSuccessAction = async (data: any) => {
  const { reference: refrence_id } = data;

  try {
    await prisma.order.update({
      where: { refrence_id },
      data: { status: "COMPLETED" }
    })

  } catch (error) {
    throw error;
  }
}

const webhook = async (req: Request, res: Response) => {
  const { event, data } = req.body;

  try {
    switch (event) {
      case "charge.success":
        await chargeSuccessAction(data);
        break;
    }

    return successAction(res);
  } catch (error) {
    return serverError(res);
  }
}
  
export default webhook;
