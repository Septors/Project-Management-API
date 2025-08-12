import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads', // куда сохраняем
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + extname(file.originalname));
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|plain|text|pdf)$/)) {
    return cb(new Error('Only images or text document!'), false);
  }
  cb(null, true);
},
};
