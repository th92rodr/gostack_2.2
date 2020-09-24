import fs from 'fs';
import path from 'path';
import csvParse from 'csv-parse';

import uploadConfig from '../config/uploadCSVFile';
import CreateTransactionService from '../services/CreateTransactionService';

interface Request {
  csvFileName: string;
}

async function loadCSV(csvFilePath: string): Promise<Array<string[]>> {
  const readCSVStream = fs.createReadStream(csvFilePath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  const lines: Array<string[]> = [];

  parseCSV.on('data', line => {
    lines.push(line);
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return lines;
}

class ImportTransactionsService {
  async execute({ csvFileName }: Request): Promise<void> {
    const csvFilePath = path.resolve(uploadConfig.path, csvFileName);

    const csv = await loadCSV(csvFilePath);

    const createTransaction = new CreateTransactionService();

    for (const line of csv) {
      await createTransaction.execute({
        title: line[0],
        type: line[1],
        value: Number(line[2]),
        category: line[3],
      });
    }
  }
}

export default ImportTransactionsService;
