import { Router } from "express";
import { validateCreateProduct, validateGetProduct, validateUpdateProduct } from "../../validators/product";
import { createProduct, getAllProducts, getOneProduct, updateProduct } from "../../controllers/product";
import { isAdmin, isAuth, uploadImage } from "../../middlewares";
import { EPermisions } from "../../utils/admin/contants";

const router = Router();

router.post('/', isAuth, isAdmin(EPermisions.CREATE_PROD), uploadImage("img", "required"), validateCreateProduct, createProduct);
router.patch('/:id', isAuth, isAdmin(EPermisions.CREATE_PROD), uploadImage("img", "optional"), validateUpdateProduct, updateProduct);
router.get('/', isAuth, getAllProducts);
router.get('/:id', isAuth, validateGetProduct, getOneProduct);


export default router;
