import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import customerRoutes from "./modules/customers/customer.routes";
import productRoutes from "./modules/products/product.routes";
import stockRoutes from "./modules/stock/stock.routes";
import challanRoutes from "./modules/challans/challan.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.use("/auth", authRoutes);
app.use("/customers", customerRoutes);
app.use("/products", productRoutes);
app.use("/stock", stockRoutes);
app.use("/challans", challanRoutes);

app.use(errorHandler);

export default app;