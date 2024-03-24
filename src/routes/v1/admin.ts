import { Router } from "express";
import { isAdmin, isAuth, uploadImage } from "../../middlewares";
import { EPermisions } from "../../utils/admin/contants";
import { validateCreateProduct, validateUpdateProduct } from "../../validators/product";
import { createProduct, updateProduct } from "../../controllers/product";

const router = Router();


router.post('/', isAuth, isAdmin(EPermisions.CREATE_PROD), uploadImage("img", "required"), validateCreateProduct, createProduct);
router.patch('/:id', isAuth, isAdmin(EPermisions.CREATE_PROD), uploadImage("img", "optional"), validateUpdateProduct, updateProduct);

export default router;
