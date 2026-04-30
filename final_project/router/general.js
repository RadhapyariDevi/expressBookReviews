const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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

public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).send(JSON.stringify(book, null, 4));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const keys = Object.keys(books);
    let filtered_books = [];
    
    keys.forEach(key => {
        if (books[key].author === author) {
            filtered_books.push({ "isbn": key, ...books[key] });
        }
    });

    if (filtered_books.length > 0) {
        return res.status(200).json({ booksbyauthor: filtered_books });
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const keys = Object.keys(books);
    let filtered_books = [];

    keys.forEach(key => {
        if (books[key].title === title) {
            filtered_books.push({ "isbn": key, ...books[key] });
        }
    });

    if (filtered_books.length > 0) {
        return res.status(200).json({ booksbytitle: filtered_books });
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).send(JSON.stringify(book.reviews, null, 4));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

//Get all books 
public_users.get('/asyncbooks', async function (req, res) {
    try {
        const getBooks = () => Promise.resolve(books);
        const result = await getBooks();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book details based on ISBN using Promises
public_users.get('/asyncisbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject("Book not found");
    })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err }));
});

// Get book details based on Author using Async/Await
public_users.get('/asyncauthor/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const keys = Object.keys(books);
        const filtered = keys.filter(key => books[key].author === author).map(key => books[key]);
        return res.status(200).json(filtered);
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
});

//Get book details based on Title using Promises
public_users.get('/asynctitle/:title', function (req, res) {
    const title = req.params.title;
    new Promise((resolve) => {
        const keys = Object.keys(books);
        const filtered = keys.filter(key => books[key].title === title).map(key => books[key]);
        resolve(filtered);
    })
    .then(result => res.status(200).json(result));
});

module.exports.general = public_users;