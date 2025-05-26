import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // You can customize this if needed
  },
});

export const upload = multer({ storage });
