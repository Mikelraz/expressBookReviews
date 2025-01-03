const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    const userExists = users.some((user) => user.username === username);
    return userExists
}

const authenticatedUser = (username, password) => {
    const exitingUser = users.find((user) => user.username === username);
    if (exitingUser) {
        return exitingUser.password === password;
    }
    return false;
};

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password must be provided." });
    }

    if (!isValid(username)) {
        return res.status(404).json({ message: "User not found. Please register first." });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });

    // Store the username and token in the session
    req.session.authorization = {
        username: username,
        accessToken: token,
    };

    res.status(200).json({
        message: "Login successful.",
        username,
        token,
    });
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username; // Get the username from the session
    const review = req.query.review;

    // Check if ISBN and review are provided
    if (!isbn || !review) {
        return res.status(400).json({ message: "ISBN and review must be provided." });
    }

    // Check if user is logged in
    if (!username) {
        return res.status(403).json({ message: "You need to log in to post a review." });
    }

    // Check if the book exists
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }

    // Initialize reviews if it doesn't exist
    if (!book.reviews) {
        book.reviews = {};
    }

    // Add or update the review
    const existingReview = book.reviews[username];
    if (existingReview) {
        book.reviews[username] = review; // Update the review
        res.status(200).json({
            message: `Review updated for user ${username}.`,
            reviews: book.reviews,
        });
    } else {
        book.reviews[username] = review; // Add a new review
        res.status(201).json({
            message: `Review added for user ${username}.`,
            reviews: book.reviews,
        });
    }
});

// Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username; // Get the username from the session

    // Check if ISBN is provided
    if (!isbn) {
        return res.status(400).json({ message: "ISBN must be provided." });
    }

    // Check if user is logged in
    if (!username) {
        return res.status(403).json({ message: "You need to log in to delete a review." });
    }

    // Check if the book exists
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }

    // Check if reviews exist
    const reviews = book.reviews;
    if (!reviews || !reviews[username]) {
        return res.status(404).json({ message: `No review found for user ${username} on book with ISBN ${isbn}.` });
    }

    // Delete the user's review
    delete book.reviews[username];

    res.status(200).json({ 
        message: `Review deleted for user ${username}.`, 
        reviews: book.reviews 
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
