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

    // Generate JWT
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
        message: "Login successful.",
        token,
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
