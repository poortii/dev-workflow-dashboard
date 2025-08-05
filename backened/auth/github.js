require('dotenv').config();
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

// We'll create a database query function in the next step to find or create a user.
const { query } = require('../db');

// Configure the GitHub strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/github/callback',
    scope: ['repo', 'read:user']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // This is where we'll handle the user.
      // For now, we'll just log the profile and proceed.
      console.log('GitHub Profile:', profile);

      // In the next step, we'll save the user to our database
      // For now, let's just pass the profile along
      return done(null, profile);

    } catch (error) {
      return done(error, null);
    }
  }
));

// Serialize and deserialize users for session management
// This part is crucial for keeping the user logged in.
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;