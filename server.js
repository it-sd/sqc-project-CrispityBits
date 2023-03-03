require('dotenv').config() // Read environment variables from .env
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5163

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

  // Step 5
   .get('/', function(req, res) {
    res.render('pages/index')
   })

  // Step 6
  .get('/about', function(req, res) {
    res.render('pages/about')
  })

  // Step 4
  .get('/health', function(req, res) {
    res.status(200).send('Healthy')
  })

// end of implementation ///////////////////////////////////
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
