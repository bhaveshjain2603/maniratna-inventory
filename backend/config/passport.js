import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
  
dotenv.config();

console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);
console.log("CLIENT SECRET:", process.env.GOOGLE_CLIENT_SECRET);  

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        'https://maniratna-dashboard.onrender.com/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {

      const user = {
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      };

      done(null, user);
    }
  )
);