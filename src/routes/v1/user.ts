import { Router } from "express";
import { createUserValidation, loginUserValidation, validateResetPassword, verifyResendOTP, verifyUserValidation } from "../../validators/user";
import { createUser, forgetPassword, getMe, login, resendOTP, resetPassword, verifyUserEmail } from "../../controllers/user";
import { isAuth } from "../../middlewares";
import { getOrderDetails, getOrders } from "../../controllers/order";
import { buyProduct } from "../../controllers/product";
import { validateBuyProduct } from "../../validators/product";
import { validateGetOrderDetails } from "../../validators/order";

const router = Router();

router.post('/', createUserValidation, createUser);
router.post('/login', loginUserValidation, login)
router.post('/verify', verifyUserValidation, verifyUserEmail)
router.get('/verify', verifyResendOTP, resendOTP)
router.post('/password', forgetPassword)
router.put('/password', validateResetPassword("forget"), resetPassword)
router.patch('/password', isAuth, validateResetPassword("old"), resetPassword)
router.get('/me', isAuth, getMe)
router.get('/orders', isAuth, getOrders("user"))
router.get('/orders/:id', isAuth, validateGetOrderDetails("user"), getOrderDetails)
router.post('/buy/:id', isAuth, validateBuyProduct, buyProduct);

export default router;
