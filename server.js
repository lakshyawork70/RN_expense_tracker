import express from "express";
import dotenv from "dotenv";
import transactionsRoute from "./src/routes/transactionsRoute.js"
import rateLimiter from "./src/middleware/rateLimiter.js";
import { initDB } from "./src/config/db.js";
dotenv.config();
const app = express();
//middleware
app.use(express.json());
app.use(rateLimiter)
const PORT = process.env.PORT || 4000;




// app.get("/health", (req, res) => {
//   res.send(`Backend Server is up and running on PORT:${PORT}`);
// });

app.use("/api/transactions",transactionsRoute)

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is up and running on PORT:${PORT}`);
  });
});
