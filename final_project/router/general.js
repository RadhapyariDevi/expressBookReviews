const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username,password} = req.body;
  if(!username || !password){
    return res.status(400).json({message: "Username and password are required"});
  }
  if(isValid(username)){
    return res.status(400).json({message: "User already exists"});
  }
  users.push({"username": username, "password": password});
  return res.status(200).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books,null,5));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
  return res.status(300).send(JSON.stringify(books[req.params.isbn],null,5));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let result = {};
  Object.keys(books).forEach((key) => {
    if(books[key].author === author){
      result[key] = books[key];
    }
  }
);
  return res.status(200).json(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let result = {};
  Object.keys(books).forEach((key) => {
    if(books[key].title === title){
      result[key] = books[key];
    }
  }
);
  return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(300).json(books[isbn].reviews);
});


public_users.get('/asyncbooks', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


public_users.get('/asyncisbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book by ISBN" });
  }
});



public_users.get('/asyncauthor/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});


public_users.get('/asynctitle/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title" });
  }
});




module.exports.general = public_users;
