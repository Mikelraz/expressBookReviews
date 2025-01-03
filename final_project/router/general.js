const express = require('express');
let books = require("./booksdb.js");
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

// Get the book list available in the shop (synchronous)
public_users.get('/',function (req, res) {
    const formattedBooks = JSON.stringify(books, null, 4); 
    res.setHeader('Content-Type', 'application/json'); 
    res.send(formattedBooks); 
});

// Get book details based on ISBN (synchronous)
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    const formattedBook = JSON.stringify(book, null, 4);
    res.setHeader('Content-Type', 'application/json'); 
    res.send(formattedBook);
});
  
// Get book details based on author (synchronous)
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; 

    const filteredBooks = Object.values(books).filter(
        (book) => book.author === author
    );

    const formattedBooks = JSON.stringify(filteredBooks, null, 4);
    res.setHeader('Content-Type', 'application/json');
    res.send(formattedBooks);
});

// Get all books based on title (synchronous)
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title; 

    const filteredBooks = Object.values(books).filter(
        (book) => book.title === title
    );

    const formattedBooks = JSON.stringify(filteredBooks, null, 4);
    res.setHeader('Content-Type', 'application/json');
    res.send(formattedBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn

    const book = books[isbn]
    res.send(book.reviews)
});

// Simulate async operation to retrieve books
async function fetchBooks() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 1000);
    });
}

// Get the book list available in the shop (asynchronous)
public_users.get('/', async function (req, res) {
    try {
        const books = await fetchBooks();
        const formattedBooks = JSON.stringify(books, null, 4); 
        res.setHeader('Content-Type', 'application/json'); 
        res.send(formattedBooks);
    } catch (error) {
        res.status(500).send(JSON.stringify({ 
            message: "An error occurred while retrieving the book list.", 
            error: error.message 
        }, null, 4));
    }
});

// Get book details based on ISBN (asynchronous)
public_users.get('/isbn/:isbn', async function (req, res) {
    try{
        const isbn = req.params.isbn;

        const books = await fetchBooks();
        const book = books[isbn];
    
        const formattedBook = JSON.stringify(book, null, 4);
        res.setHeader('Content-Type', 'application/json'); 
        res.send(formattedBook);

    } catch (error) {
        res.status(500).send(JSON.stringify({ 
            message: "An error occurred while retrieving book details.", 
            error: error.message 
        }, null, 4))}
});

// Get book details based on author (asynchronous)
public_users.get('/author/:author', async function (req, res) {
    try{
        const author = req.params.author; 
        
        const books = await fetchBooks();
        const filteredBooks = Object.values(books).filter(
            (book) => book.author === author
        );
    
        const formattedBooks = JSON.stringify(filteredBooks, null, 4);
        res.setHeader('Content-Type', 'application/json');
        res.send(formattedBooks);
    } catch (error) {
        res.status(500).send(JSON.stringify({ 
            message: "An error occurred while retrieving book details.", 
            error: error.message 
        }, null, 4))}
});

// Get all books based on title (asynchronous)
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title; 

        const books = await fetchBooks();
        const filteredBooks = Object.values(books).filter(
            (book) => book.title === title
        );
    
        const formattedBooks = JSON.stringify(filteredBooks, null, 4);
        res.setHeader('Content-Type', 'application/json');
        res.send(formattedBooks);

    } catch (error) {
        res.status(500).send(JSON.stringify({ 
            message: "An error occurred while retrieving book details.", 
            error: error.message 
        }, null, 4))}
});

module.exports.general = public_users;
