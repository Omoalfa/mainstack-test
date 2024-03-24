import { Router } from "express";
import userRouter from "./user"
import orderRouter from "./order"
import productRouter from "./product"
import adminRouter from "./admin"
import { validatePaystack } from "../../middlewares";
import webhook from "../../controllers/paystack";

const router = Router()

router.use('/product', productRouter)
router.use('/order', orderRouter)
router.use('/user', userRouter)
router.use('/admin', adminRouter)
router.use('/paystack', validatePaystack, webhook)

export default router;
