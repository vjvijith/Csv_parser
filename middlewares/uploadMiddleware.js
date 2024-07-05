const multer = require('multer');
const path = require('path');

const fileStorage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,'uploads');
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname + '-'+ Date.now() );
    },
});

// const fileFilter = (req,file,cb) =>{
//     console.log(`File MIME type: ${file.mimetype}`);
//     if(file.mimetype.startsWith('image/')){
//         cb(null,true);
//     } else{
//         cb(new Error('Invalid file type'),false);
//     }
// };

const upload = multer({ storage: fileStorage });

module.exports = upload.single('file');
