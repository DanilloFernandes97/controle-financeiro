const express = require('express');
const transactionRouter = express.Router();
const TransactionService = require('../services/transactionService');
const TransactionModel = require('../models/TransactionModel');

// Retorna transaction de acordo com a queryParam yyyy-dd (ano-mes)
//se nao for passado periodo por parametro nao retorna nada
transactionRouter.get('/', async (request, response) => {
  const { period } = request.query;
  try {
    console.log(period);
    // se nao for passado periodo busca por todos os periodos de forma distinta
    if (typeof period === 'undefined') {
      const distinctTransactions = await TransactionService.findDistinctTransactions();
      response.send(distinctTransactions);
    } else {
      const transactions = await TransactionService.findTransactionByPeriod(
        period
      );
      response.send(transactions);
    }
  } catch (err) {
    response.send(err);
  }
});

// Cria uma nova transaction
transactionRouter.post('/', async (request, response) => {
  const newTransaction = request.body;
  if (!newTransaction) response.send('Informe os dados da nova transaction');
  try {
    const InsertedTransaction = await TransactionService.createTransaction(
      newTransaction
    );
    response.send(InsertedTransaction);
  } catch (err) {
    response.send(err);
  }
});

// Atualiza a transaction, de acordo com os campos passados por parametro.
transactionRouter.patch('/:id', async (request, response) => {
  const updateFields = request.body;
  const { id } = request.params;
  try {
    const updatedTransaction = await TransactionService.updateTransaction(
      id,
      updateFields
    );
    response.send(updatedTransaction);
  } catch (err) {
    response.send(err);
  }
});

// Remove a transacao de acordo com o id passado por parametro
transactionRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  try {
    const deletedTransaction = await TransactionService.deleteTransaction(id);
    response.send(deletedTransaction);
  } catch (err) {
    response.send(err);
  }
});

transactionRouter.delete('/', async (request, response) => {
  try {
    const deleteAll = await TransactionModel.deleteMany({});
    response.end();
  } catch (err) {
    response.send(err);
  }
});

module.exports = transactionRouter;