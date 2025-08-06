import express from "express";
import dotenv from "dotenv";
import transactionsRoute from "./src/routes/transactionsRoute.js"
import rateLimiter from "./src/middleware/rateLimiter.js";
import { initDB } from "./src/config/db.js";
import job from "./src/config/cron.js";
dotenv.config();
const app = express();
if(process.env.NODE_ENV==="production") job.start();
//middleware
app.use(express.json());
app.use(rateLimiter)
const PORT = process.env.PORT || 4000;




// app.get("/health", (req, res) => {
//   res.send(`Backend Server is up and running on PORT:${PORT}`);
// });

app.use("/api/transactions",transactionsRoute)
app.get('/api/health',(req,res)=>{
  res.status(200).json({status:"ok"})
})

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is up and running on PORT:${PORT}`);
  });
});
