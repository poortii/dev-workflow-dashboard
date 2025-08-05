require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session); // To store sessions in our DB
const { Pool } = require('pg'); // We'll use this for the session store

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection for session store
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Middleware
app.use(cors());
app.use(express.json());

// Session middleware setup
app.use(session({
  store: new pgSession({
    pool: pgPool, // Use our existing connection pool
    tableName: 'user_sessions' // We will create this table soon
  }),
  secret: 'a very secret key', // <-- REPLACE THIS WITH A REAL SECRET IN .env
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Basic route to test the server
app.get('/', (req, res) => {
  res.send('Welcome to the Dev Workflow Dashboard API!');
});


// GitHub OAuth routes
app.get('/auth/github',
  passport.authenticate('github', { scope: ['repo', 'read:user'] })
);

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000'); // We'll use this for our React app later
  }
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});