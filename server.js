import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import auth from "./routes/auth.js";
import bill from "./routes/bill.js";
import requestBill from "./routes/requestBill.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

//db config
const port = process.env.PORT || 8000;
const URL = `mongodb+srv://${process.env.DB_HOST}:${process.env.DB_KEY}@cluster0.ztbed.mongodb.net/billintVaultDB?retryWrites=true&w=majority`;
mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() =>
    app.listen(port, (req, res) =>
      console.log("server is up and running in port 8000")
    )
  )
  .catch((err) => console.log(err.message));

//middlewares
app.use(express.json());
app.use(cors());
app.use("/api/auth", auth);
app.use("/api/bill", bill);
app.use("/api/requestBill", requestBill);

//routes
app.get("/", (req, res) => res.status(200).send("hello"));
