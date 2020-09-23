import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  transactionId: string;
}

class DeleteTransactionService {
  public async execute({ transactionId }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionRepository);

    const transaction = await transactionsRepository.findOne(transactionId);

    if (!transaction) {
      throw new AppError('This transaction does not exists.');
    }

    await transactionsRepository.delete(transactionId);
  }
}

export default DeleteTransactionService;
