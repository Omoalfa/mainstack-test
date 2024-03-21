import { Response } from "express"

interface Paginated<T> {
  list: T,
  page: number,
  limit: number,
  total?: number,
}

export function created<T>(res: Response, data: T, message = "Successful") {
  return res.status(201).json({
    message,
    data,
    success: true,
  })
}

export function successAction(res: Response, message = "Successful") {
  return res.status(200).json({
    message,
    data: null,
    success: true,
  })
}

export function successPaginated<T>(res: Response, data: Paginated<T>, message = "Fetched successfully") {
  return res.status(200).json({
    message,
    data,
    success: true,
  })
}

export function serverError(res: Response, message = "Something went wrong") {
  return res.status(500).json({
    message,
    error: null,
    success: false,
  })
}

export function success<T> (res: Response, data: any, message = "Successful") {
  return res.status(200).json({
    message,
    data: data,
    success: true,
  })
} 

export function badRequest<T> (res: Response, errors: T, message = "Bad request") {
  return res.status(400).json({
    message,
    errors,
    success: false,
  })
}

export function unAthorized<T>(res: Response, error: T, message = "Unauthorized request") {
  return res.status(400).json({
    message,
    error,
    success: false,
  })
}

export function notAllowed (res: Response, error: any, message = "Not allowed") {
  res.status(403).json({
    message,
    error,
    success: false,
  })
}

export const asyncWrapper = async (func: Function) => {
  try {
    await func()
  } catch (error) {
    console.log(error)
    throw new Error("...")
  }
}
