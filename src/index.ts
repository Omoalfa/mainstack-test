import express, { Request, Response } from "express";
import v1Router from "./routes/v1"
import { config } from "dotenv";
import fileUpload from "express-fileupload";
import { createSuperAdmin } from "./utils/admin/helper";

config()

const app = express();

app.use(express.json())

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

app.use("/api/v1", v1Router);


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

createSuperAdmin().then(result => {
  console.log(result.message) 
}).catch(error => {
  console.log(error.message);
})

const server = app.listen(process.env.PORT, () => {
  console.log(`
  🚀 Server ready at: http://localhost:${process.env.PORT}
  ⭐️ See sample requests at: ${process.env.POSTMAN_DOC}`)
})

export default server;
