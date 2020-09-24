import multer from 'multer';
import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import uploadConfig from '../config/uploadCSVFile';
import DeleteTransactionService from '../services/DeleteTransactionService';
import CreateTransactionService from '../services/CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

const uploadCSV = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute({ transactionId: id });

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  uploadCSV.single('file'),
  async (request, response) => {
    const importTransactions = new ImportTransactionsService();

    await importTransactions.execute({
      csvFileName: request.file.filename,
    });

    return response.status(201).send();
  },
);

export default transactionsRouter;
