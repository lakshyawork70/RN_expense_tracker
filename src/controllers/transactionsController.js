 import { sql } from "../config/db.js"; // path must be correct

 
 
 const createTransaction = async(req, res) => {
  //title , amount , category , userid
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || !amount || !category || !user_id === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`
    INSERT INTO transactions(user_id,title,amount,category) 
    VALUES (${user_id},${title},${amount},${category}) 
    RETURNING *
    `;
    // console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating the transaction", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const getTransactionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const transactions = await sql`
    SELECT * FROM transactions WHERE user_id=${userId} ORDER BY created_at DESC
    `;
    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error getting the transactions", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const deleteTransactionsById = async (req, res) => {
  try {
    const { id } = req.params;

    // if(isNaN(parseInt(id))){
    //     return res.status(400).json({message:`Invalid transaction ID: ${id}`})
    // }

    // Strict check: ID must be digits only
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: `Invalid transaction ID` });
    }

    const result = await sql`
    DELETE FROM transactions WHERE id = ${id} RETURNING *
    `;
    if (result.length === 0) {
      return res.status(400).json({ message: "Transaction not found" });
    } else {
      res.status(200).json({ message: "Transaction deleted successfully" });
    }
  } catch (error) {
    console.log("Error deleting the transactions", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


const getSummaryByUserId = async (req, res) => {
  try {
    const {userId} = req.params;

    const balanceResult = await sql`
    SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}
    `;

    const incomeResult = await sql`
    SELECT COALESCE(SUM(amount),0) as income FROM transactions 
    WHERE user_id = ${userId} AND amount > 0
    `;

    const expenseResult = await sql`
    SELECT COALESCE(SUM(amount),0) as expenses FROM transactions 
    WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
        balance:balanceResult[0].balance,
        income:incomeResult[0].income,
        expense:expenseResult[0].expenses,

    })

  } catch (error) {
    console.log("Error getting the summary", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export  { createTransaction , getTransactionsByUserId,deleteTransactionsById ,getSummaryByUserId }