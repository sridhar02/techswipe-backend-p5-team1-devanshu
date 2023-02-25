require("dotenv").config();
const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const { BASE_URL 
  ,LINKEDIN_CLIENT_ID 
  ,LINKEDIN_CLIENT_SECRET 
} = process.env

passport.use(
  new LinkedInStrategy(
    {
      clientID: LINKEDIN_CLIENT_ID,
      clientSecret: LINKEDIN_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/auth/linkedin/callback`,
      scope: ["r_emailaddress", "r_liteprofile"],
      state: true,
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
