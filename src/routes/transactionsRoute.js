import express from 'express'
import { createTransaction, deleteTransactionsById, getSummaryByUserId, getTransactionsByUserId } from '../controllers/transactionsController.js';


const transactionsRoute = express.Router();



transactionsRoute.post("/",createTransaction);

transactionsRoute.get("/:userId", getTransactionsByUserId);

transactionsRoute.delete("/:id", deleteTransactionsById);

transactionsRoute.get("/summary/:userId", getSummaryByUserId);

export default transactionsRoute;