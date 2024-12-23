const { google } = require('googleapis');
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Generate an authentication URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline', // To get the refresh token
  scope: ['https://www.googleapis.com/auth/gmail.send'],
});

console.log('Authorize this app by visiting this url:', authUrl);

// After you visit the URL, Google will redirect you to your REDIRECT_URI with a code in the query string
// Copy that code here:

const code = '4/0AanRRrvnfPRNianUNhTBj9HoSIuprZp7BKpuDhy-olTZHELpiXrt077qi0-KR1nqkbEBqA'; // Paste the code you get after authentication

async function getTokens() {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token); // This is the token you'll need to store securely
  } catch (error) {
    console.error('Error retrieving tokens:', error);
  }
}

getTokens();
