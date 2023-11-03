import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db";
import routes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

connectDB();
routes(app);

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log("Server is running at port", PORT);
});
