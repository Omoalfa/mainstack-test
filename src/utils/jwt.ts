import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (data: { email: string, id: string }): string => {
  return jwt.sign(data, JWT_SECRET);
}

export const encodeOTP = (code: string, email: string): string => {
  return jwt.sign({ code, email }, JWT_SECRET, { expiresIn: "15m" })
}

export const decodeOTP = (token: string): { email: string, code: string } => {
  return jwt.decode(token) as { email: string, code: string, exp: number };
}

export const decodeToken = (token: string): { email: string, id: string } => {
  return jwt.decode(token) as { email: string, id: string, exp: number };
}
