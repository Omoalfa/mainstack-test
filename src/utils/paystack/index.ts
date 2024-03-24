import axios, { Axios, AxiosResponse } from "axios";
import { CreateCharge } from "./interface";
import { AsyncFunc } from "../../interface";
const PAYSTACK_KEY = process.env.PAYSTACK_KEY as string;

class Paystack {
  constructor () {
    this.secretKey = PAYSTACK_KEY;
    this.url = "https://api.paystack.co"
    
    this.api = axios.create({
      baseURL: this.url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.secretKey}`
      }
    })
  }

  private secretKey: string;
  private url: string;
  private api: Axios

  private asyncWrapper<T>(fn: AsyncFunc<T, AxiosResponse>) {
    return async (arg: T) => {
      try {
        const res = await fn(arg);
        
        if (res.status) {
          return res.data.data;
        }

        throw new Error(res.data)
      } catch (error) {
        console.log(error)
        throw error;
      }
    }
  }

  public createCharge = this.asyncWrapper(
    async (data: CreateCharge) => {
      return await this.api.post("/transaction/initialize", data)
    }
  )

  public verifyTransaction = this.asyncWrapper(
    async (data: string) => {
      return await this.api.get("/transaction/verify/" + data);
    }
  )
}

export default Paystack;
