import { Router } from "express";
import { createUserValidation, validateResetPassword } from "../validators/user";
import { createUser, forgetPassword, getMe, login, resetPassword } from "../controllers/user";

const router = Router();

router.post('/', createUserValidation, createUser);
router.post('/login', login)
router.post('/password', forgetPassword)
router.patch('/password', validateResetPassword("forget"), resetPassword)
router.put('/password', validateResetPassword("old"), resetPassword)
router.get('/me', getMe)

export default router;
