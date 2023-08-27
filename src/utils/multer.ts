// import multer from 'multer';
// import path from 'path';


// const storage = multer.memoryStorage(); // Store uploaded files in memory as buffers

// const imageUpload = multer({ storage: multer.memoryStorage(), fileFilter: imageFileFilter });
// const pdfUpload = multer({ storage: multer.memoryStorage(), fileFilter: pdfFileFilter });

// //const pdfUpload = multer({ storage: storage, fileFilter: pdfFileFilter });

// // File filter functions
// function imageFileFilter(req: any, file: Express.Multer.File, cb: any) {
//   console.log('Uploaded file mimetype:', file.mimetype);

//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed!'), false);
//   }
// }


// function pdfFileFilter(req: any, file: Express.Multer.File, cb: any) {
//   console.log('Uploaded file mimetype:', file.mimetype);

//   if (file.mimetype === 'application/pdf') {
//     cb(null, true);
//   } else {
//     cb(new Error('Only PDF files are allowed!'), false);
//   }
// }

// export { imageUpload, pdfUpload };

import multer from 'multer';
import fs from 'fs';
const path = require('path');




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'coverImage') {
      cb(null, 'uploads/coverImages/');
    } else if (file.fieldname === 'filePDF') {
      cb(null, 'uploads/pdfFiles/');
    } else if (file.fieldname === 'performerImage'){
      cb(null, 'uploads/performerImage/');
    }
  },
  // filename: (req, file, cb) => {
  //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //   cb(null, file.fieldname + '-' + uniqueSuffix);
  // },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}_${path.extname(file.originalname)}`;
    cb(null, fileName);
},
});


const uploadDirectories = ['uploads/coverImages', 'uploads/pdfFiles', 'uploads/performerImage'];
uploadDirectories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file types for coverImage and filePDF fields
  if (file.fieldname === 'coverImage' && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else if (file.fieldname === 'filePDF' && file.mimetype === 'application/pdf') {
    cb(null, true);
  } else if (file.fieldname === 'performerImage' && file.mimetype.startsWith('image/')) {
    cb(null, true);
  }else {
    cb(new Error('Invalid file type'));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;


