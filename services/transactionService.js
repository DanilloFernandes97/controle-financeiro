const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Aqui havia um erro difícil de pegar. Importei como "transactionModel",
// com "t" minúsculo. No Windows, isso não faz diferença. Mas como no Heroku
// o servidor é Linux, isso faz diferença. Gastei umas boas horas tentando
// descobrir esse erro :-/
const TransactionModel = require('../models/TransactionModel');

// tras as transactions de forma distinta
exports.findDistinctTransactions = async () => {
  try {
    const transactions = await TransactionModel.distinct('yearMonth');
    return transactions;
  } catch (err) {
    return err;
  }
};

// filtra transactions por yyyy-dd
exports.findTransactionByPeriod = async (period) => {
  try {
    const transactions = await TransactionModel.find({
      $or: [{ yearMonth: period }, { yearMonthDay: period }],
    });
    return transactions;
  } catch (err) {
    console.log('erro em findAll');
  }
};

//cria nova transacao
exports.createTransaction = async (newTransaction) => {
  try {
    const insertedTransaction = new TransactionModel(newTransaction);
    await insertedTransaction.save();
    return insertedTransaction;
  } catch (err) {
    console.log(err);
    return;
  }
};

//atualiza os campos passados pelo req.body de uma transacao
exports.updateTransaction = async (id, updateFields) => {
  try {
    const updatedTransaction = TransactionModel.updateOne(
      { _id: id },
      updateFields,
      { new: true }
    );
    return updatedTransaction;
  } catch (err) {
    return err;
  }
};

//deleta transacao de acordo com id
exports.deleteTransaction = async (id) => {
  try {
    const deletedTransaction = await TransactionModel.deleteOne({ _id: id });
  } catch (err) {
    return err;
  }
};
