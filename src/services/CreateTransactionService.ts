import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getRepository(Category);

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Invalid value for transaction type.');
    }

    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance();

      if (balance.total - value < 0) {
        throw new AppError('Not enough funds to complete transaction.');
      }
    }

    let categoryEntity = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categoryEntity) {
      categoryEntity = categoriesRepository.create({ title: category });
      await categoriesRepository.save(categoryEntity);
    }

    const newTransaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryEntity.id,
    });
    await transactionsRepository.save(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
