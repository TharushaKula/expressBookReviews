const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if a user with the given username already exists
const isValid = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}


const authenticatedUser = (username, password) => {
  //returns boolean
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60000 }
    );

    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  // Check if the book exists
  if (book) {
    const review = req.body.review;

    // Check if the review is provided
    if (review) {
      // Add or replace review based on user authentication
      if (!book.reviews) {
        book.reviews = [];  // Initialize reviews array if not present
      }

      // Assuming user has a unique identifier, e.g., username from req.session.authorization.username
      const username = req.session.authorization.username;

      // Add or update the user's review
      const userReviewIndex = book.reviews.findIndex((r) => r.username === username);
      if (userReviewIndex >= 0) {
        // Update existing review
        book.reviews[userReviewIndex].review = review;
        res.status(200).send("Review updated successfully");
      } else {
        // Add new review
        book.reviews.push({ username, review });
        res.status(200).send("Review added successfully");
      }
    } else {
      res.status(400).send("Review not provided");
    }
  } else {
    res.status(404).send("Book not found");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (isbn) {
    delete books[isbn];
  }
  res.send(`Friend with the email ${isbn} deleted.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
