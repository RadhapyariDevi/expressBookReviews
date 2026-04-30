const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: "Username and password are required" });
  }

  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(404).json({ message: "User already exists!" });
  }

  users.push({ "username": username, "password": password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  }
  return res.status(404).json({ message: "Book not found" });
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books);
  let filtered_books = [];
  keys.forEach(key => {
    if (books[key].author === author) {
      filtered_books.push({ "isbn": key, ...books[key] });
    }
  });
  return res.status(200).json({ booksbyauthor: filtered_books });
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books);
  let filtered_books = [];
  keys.forEach(key => {
    if (books[key].title === title) {
      filtered_books.push({ "isbn": key, ...books[key] });
    }
  });
  return res.status(200).json({ booksbytitle: filtered_books });
});

// Task 5: Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  }
  return res.status(404).json({ message: "Book not found" });
});

// --- ASYNC TASKS USING AXIOS ---

// Task 10: Get all books using Async/Await and Axios
public_users.get('/asyncbooks', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list" });
  }
});

// Task 11: Get book details based on ISBN using Promise callbacks and Axios
public_users.get('/asyncisbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(err => {
      return res.status(404).json({ message: "Book not found" });
    });
});

// Task 12: Get book details based on Author using Async/Await and Axios
public_users.get('/asyncauthor/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Task 13: Get book details based on Title using Promise callbacks and Axios
public_users.get('/asynctitle/:title', function (req, res) {
  const title = req.params.title;
  axios.get(`http://localhost:5000/title/${title}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(err => {
      return res.status(500).json({ message: "Error fetching books by title" });
    });
});

module.exports.general = public_users;