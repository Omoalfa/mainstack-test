import express, { Request, Response } from "express";
import userRoute from "./routes/user"
import productRoute from "./routes/product"
import orderRoute from "./routes/order"
import { config } from "dotenv";
import fileUpload from "express-fileupload";

config()

const app = express();

app.use(express.json())

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

app.use("/users", userRoute);
app.use("/products", productRoute);
app.use("/orders", orderRoute);


app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Welcome to mainstack test app!",
    data: {
      documentation: process.env.POSTMAN_DOC
    }
  })
})

app.get("/doc", (req: Request, res: Response) => {
  return res.redirect(process.env.POSTMAN_DOC as string)
})

const server = app.listen(process.env.PORT, () => {
  console.log(`
  🚀 Server ready at: http://localhost:${process.env.PORT}
  ⭐️ See sample requests at: ${process.env.POSTMAN_DOC}`)
})

export default server;
