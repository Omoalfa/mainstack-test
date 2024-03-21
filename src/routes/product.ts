import { Router } from "express";
import { validateCreateProduct, validateGetProduct, validateUpdateProduct } from "../validators/product";
import { createProduct, getAllProducts, getOneProduct, updateProduct } from "../controllers/product";
import { isAuth, uploadImage } from "../middlewares";

const router = Router();

router.post('/', isAuth, uploadImage("img", "required"), validateCreateProduct, createProduct);
router.patch('/:id', isAuth, uploadImage("img", "optional"), validateUpdateProduct, updateProduct);
router.get('/:id', isAuth, validateGetProduct, getOneProduct);
router.get('/:id', isAuth, getAllProducts);


export default router;
