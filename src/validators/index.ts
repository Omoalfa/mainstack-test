import { NextFunction, Request, Response } from "express";
import { Schema, checkSchema, validationResult } from "express-validator";
import { badRequest } from "../utils/api_response";


const validate = (schema: Schema) => async (req: Request, res: Response, next: NextFunction) => {
  await Promise.all(checkSchema(schema).map(validation => validation.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const errs = errors.array();

  return badRequest(res, errs, errs[0].msg)
};

export default validate;
