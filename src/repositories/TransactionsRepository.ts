import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const balance = transactions.reduce(
      (accumulator, current) => {
        if (current.type === 'income') {
          accumulator.income = accumulator.income + current.value;
          accumulator.total = accumulator.total + current.value;
        } else {
          accumulator.outcome = accumulator.outcome + current.value;
          accumulator.total = accumulator.total - current.value;
        }

        return accumulator;
      },
      { income: 0, outcome: 0, total: 0 },
    );

    return balance;
  }
}

export default TransactionsRepository;
