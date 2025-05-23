import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import productRoutes from "./routes/product.route.js"

//0z33iZjrWJ19PQ11

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/products",productRoutes)



app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
});