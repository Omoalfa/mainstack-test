import { Router } from "express";
import { isAdmin, isAuth } from "../../middlewares";
import { EPermisions } from "../../utils/admin/contants";
import { getOrderDetails, getOrders } from "../../controllers/order";
import { validateGetOrderDetails } from "../../validators/order";

const router = Router();

router.get('/', isAuth, isAdmin(EPermisions.READ_ORDER), getOrders);
router.get('/:id', isAuth, isAdmin(EPermisions.READ_ORDER), validateGetOrderDetails("admin"), getOrderDetails)

export default router;
