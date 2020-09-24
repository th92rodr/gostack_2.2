import path from 'path';
import multer from 'multer';

const tmpFolderPath = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  path: tmpFolderPath,
  storage: multer.diskStorage({
    destination: tmpFolderPath,
    filename: (request, file, callback) => {
      return callback(null, file.originalname);
    },
  }),
};
