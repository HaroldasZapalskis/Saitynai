const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const epilogue = require('epilogue')
const OktaJwtVerifier = require('@okta/jwt-verifier')
const multer = require('multer')

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: '0oai38iup3XiPNBt90h7',
  issuer: 'https://dev-547225.oktapreview.com/oauth2/default'
})

let app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('assets'))
var publicDir = require('path').join(__dirname, '../public')
app.use('/public', express.static(publicDir))
app.use((req, res, next) => {
  // require every request to have an authorization header
  if (!req.headers.authorization) {
    return next(new Error('Authorization header is required'))
  }
  let parts = req.headers.authorization.trim().split(' ')
  let accessToken = parts.pop()
  oktaJwtVerifier.verifyAccessToken(accessToken)
    .then(jwt => {
      req.user = {
        uid: jwt.claims.uid,
        email: jwt.claims.sub
      }
      next()
    })
    .catch(next) // jwt did not verify!
})
let database = new Sequelize('Saitynai', 'root', 'stefa123', {
  dialect: 'mysql',
  storage: './test.mysql'
})

// Define our Post model
// id, createdAt, and updatedAt are added by sequelize automatically
let Post = database.define('posts', {
  title: Sequelize.STRING,
  body: Sequelize.TEXT,
  image: Sequelize.STRING
})

// Initialize epilogue
epilogue.initialize({
  app: app,
  sequelize: database
})

// Create the dynamic REST resource for our Post model
let userResource = epilogue.resource({
  model: Post,
  endpoints: ['/posts', '/posts/:id']
})

// Resets the database and launches the express app on :8081
database
  .sync()
  .then(() => {
    app.listen(8081, () => {
      console.log('listening to port localhost:8081')
    })
  })
const path = require('path')
const multerConfig = {
  storage: multer.diskStorage({
    destination: function (req, file, next) {
      next(null, path.join(__dirname, '../public/img'))
    },
    filename: function (req, file, next) {
      const ext = file.mimetype.split('/')[1]
      const filename = file.fieldname + '-' + Date.now()
      multerConfig.filename = filename + '.' + ext
      next(null, filename + '.' + ext)
    }
  }),
  fileFilter: function (req, file, next) {
    if (!file) {
      next()
    }
    const image = file.mimetype.startsWith('image/')
    if (image) {
      next(null, true, file)
    } else {
      return next()
    }
  },
  filename: ''
}
app.post('/upload', multer(multerConfig).single('image'), function (req, res) {
  if (multerConfig.filename != null) {
    let name = multerConfig.filename
    multerConfig.filename = null
    res.status(200).send({ message: 'Image uploaded to server', name: name })
  } else {
    res.status(200).send({ error: 'No image uploaded' })
  }
})
// app.post('/upload', function (req, res) {
//   var path = require('path')
//   // console.log(req)
//   req.sendFile(path.join(__dirname, '/assets'))
//   // res.statusCode = 200
// })
// app.post('/upload', function (req, res) {
//   console.log(req.files.foo) // the uploaded file object
// })
