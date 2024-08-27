const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    try {
      // Assume isValid is an asynchronous function
      const userExists = await isValid(username);

      // Check if the user does not already exist
      if (!userExists) {
        // Add the new user to the users array
        users.push({ username: username, password: password });
        return res
          .status(200)
          .json({ message: "User successfully registered. Now you can login" });
      } else {
        return res.status(404).json({ message: "User already exists!" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  // Return error if username or password is missing
  return res.status(400).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    // Assume fetching books might be an asynchronous operation
    const bookList = await books;
    res.json(bookList);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    // Assume accessing books might be an asynchronous operation
    const book = await books[isbn];
    res.send(book);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  try {
    const author = req.params.author;
    // Assume filtering books might be an asynchronous operation
    const booksByAuthor = await books.filter((book) => book.author === author);
    res.send(booksByAuthor);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  try {
    const title = req.params.title;
    // Assume filtering books might be an asynchronous operation
    const booksByTitle = await books.filter((book) => book.title === title);
    res.send(booksByTitle);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book review
public_users.get("/review/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    // Assume accessing book reviews might be an asynchronous operation
    const reviews = await books[isbn].reviews;
    res.send(reviews);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports.general = public_users;
