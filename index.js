require('dotenv').config()
const axios = require('axios')
const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(express.static('static'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + "/static/index.html"))
})

app.get('/auth', (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`)
})

app.get('/oauth-callback', ({query:{code}}, res) => {
  const body = {
    client_id:process.env.CLIENT_ID,
    client_secret:process.env.CLIENT_SECRET,
    code
  }

  const opts = {headers:{accept:'application/json'}}

  axios
  .post('https://github.com/login/oauth/access_token', body, opts)
  .then((_res) => _res.data.access_token)
  .then((token) => {
    console.log('My token:', token)
    res.redirect(`/?token=${token}`)
  })
  .catch((err) => res.status(500).json({err: err.message}))

  // Redirect with the token
  res.redirect(`/?token=${token}`); // This should redirect to the main page
})




app.get('/check-following', async (req, res) => {
  const token = req.query.token;

  if (!token) {
      return res.status(401).send('Authentication required. Please provide a valid token.');
  }

  try {
      const response = await axios.get('https://api.github.com/user/following/BYTE_DEVS', {
          headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/vnd.github+json',
              'X-GitHub-Api-Version': '2022-11-28'
          }
      });

      if (response.status === 204) {
          res.send('You are following BYTE_DEVS.');
      }
  } catch (error) {
      console.error(error); // Log the error to console
      if (error.response) {
          console.log('Error response data:', error.response.data);
          if (error.response.status === 404) {
              res.send('You are not following BYTE_DEVS.');
          } else if (error.response.status === 401) {
              res.send('Authentication required. Please check your token.');
          } else if (error.response.status === 403) {
              res.send('Access forbidden. You may not have permission.');
          } else {
              res.send(`Error: ${error.response.status}`);
          }
      } else {
          res.send('Error: ' + error.message);
      }
  }
});


app.listen(3000)