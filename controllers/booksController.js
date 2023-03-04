const Joi = require("joi");
const fs = require("fs");
const path = require("path");
const Book = require("../models/Book");

const bookSchema = Joi.object({
  title: Joi.string().trim().required(),
  author: Joi.string().trim().required(),
});

const sanitizeFilename = (filename) => {
  const basename = path.basename(filename);
  return basename.replace(/(\.\.\/|\/)/g, "_");
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().select("id title author");
    res.status(200).send(books);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, msg: "Error getting books" });
  }
  // res.send(books);
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send({ success: false, msg: "Book not found" });
    }
    return res.status(200).send(book);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, msg: "Server Error" });
  }
};

const createBook = async (req, res) => {
  const { title, author } = req.body;
  const book = new Book({ title, author });
  try {
    const newBook = await book.save();
    return res
      .status(201)
      .send({ id: newBook.id, title: newBook.title, author: newBook.author });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, msg: "Server Error" });
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!book) {
      return res.status(404).send({ success: false, msg: "Book not found" });
    }
    return res.status(200).send(book);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false, msg: "Server Error" });
  }
};

const deleteBookById = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(400).send({ success: false, msg: "Book not found" });
    }
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false, msg: "Server Error" });
  }
};

const uploadBook = async (req, res) => {
  const { filename, content } = req.body;

  const sanitizedFilename = sanitizeFilename(filename);

  const validExtensions = [".jpg", ".png", ".gif", ".jpeg"];

  const fileExtension = path.extname(filename);
  if (!validExtensions.includes(fileExtension)) {
    return res
      .status(400)
      .send({ success: false, msg: "Invalid file extension" });
  }

  if (!filename.trim() || !content.trim()) {
    return res
      .status(400)
      .send({ success: false, msg: "Filename or content is empty" });
  }

  const timestamp = new Date().getTime();
  const modifiedFileName = `${timestamp}-${filename}`;

  const writeStream = fs.createWriteStream(`uploads/${sanitizedFilename}`);
  writeStream.write(content, () => {
    writeStream.end();
  });

  writeStream.on("finish", () => {
    return res.status(200).send("File uploaded successful;y");
  });
};

module.exports = {
  getAllBooks,
  updateBook,
  getBookById,
  deleteBookById,
  createBook,
  uploadBook,
};
