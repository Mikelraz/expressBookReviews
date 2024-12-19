const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json(
            { message: "Username and password must be provided." }
        );
    }

    const userExists = users.some((user) => user.username === username);
    if (userExists) {
        return res.status(409).json(
            { message: "Username already exists. Please choose a different one." }
        );
    }

    users.push({ username, password });
    res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    try {
        const formattedBooks = JSON.stringify(books, null, 4); 
        res.setHeader('Content-Type', 'application/json'); 
        res.send(formattedBooks); 
    } catch (error) {
        res.status(500).send(JSON.stringify({ 
            message: "An error occurred while retrieving the book list.", 
            error: error.message 
        }, null, 4)); // Pretty-print the error response
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    const formattedBook = JSON.stringify(book, null, 4);
    res.setHeader('Content-Type', 'application/json'); 
    res.send(formattedBook);
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; 

    const filteredBooks = Object.values(books).filter(
        (book) => book.author === author
    );

    const formattedBooks = JSON.stringify(filteredBooks, null, 4); // Pretty-print JSON
    res.setHeader('Content-Type', 'application/json');
    res.send(formattedBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title; 

    const filteredBooks = Object.values(books).filter(
        (book) => book.title === title
    );

    const formattedBooks = JSON.stringify(filteredBooks, null, 4); // Pretty-print JSON
    res.setHeader('Content-Type', 'application/json');
    res.send(formattedBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn

    const book = books[isbn]
    res.send(book.reviews)
});

module.exports.general = public_users;
