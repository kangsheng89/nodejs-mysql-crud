require('dotenv').config()
var express = require('express')
var app = express()
var mysql = require('mysql')

/**
 * This middleware provides a consistent API 
 * for MySQL connections during request/response life cycle
 */ 
var myConnection  = require('express-myconnection')
/**
 * Store database credentials in a separate config.js file
 * Load the file/module and its values
 */ 
var dbOptions = {
	host:	  process.env.DB_HOST,
	user: 	  process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: 	  process.env.DB_PORT, 
	database: process.env.DB_NAME
}
/**
 * 3 strategies can be used
 * single: Creates single database connection which is never closed.
 * pool: Creates pool of connections. Connection is auto release when response ends.
 * request: Creates new connection per new request. Connection is auto close when response ends.
 */ 
app.use(myConnection(mysql, dbOptions, 'pool'))
app.get('/healthcheck', (req, res) => {
	req.getConnection(function(error, conn) {
		try {
			conn.query('SHOW GLOBAL VARIABLES LIKE ‘max_connections’;', function(err, rows) {
				//if(err) throw err
				if (err) {
					res.json(err)
				} else {
					// render to views/user/list.ejs template file
					res.json('Healthy')
				}
			})
		} catch(err) {
			res.status(500)
			res.json(err.message)
		}
	})
})

/**
 * setting up the templating view engine
 */ 
app.set('view engine', 'ejs')

/**
 * import routes/index.js
 * import routes/users.js
 */ 
var index = require('./routes/index')
var users = require('./routes/users')


/**
 * Express Validator Middleware for Form Validation
 */ 
var expressValidator = require('express-validator')
app.use(expressValidator())


/**
 * body-parser module is used to read HTTP POST data
 * it's an express middleware that reads form's input 
 * and store it as javascript object
 */ 
var bodyParser = require('body-parser')
/**
 * bodyParser.urlencoded() parses the text as URL encoded data 
 * (which is how browsers tend to send form data from regular forms set to POST) 
 * and exposes the resulting object (containing the keys and values) on req.body.
 */ 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


/**
 * This module let us use HTTP verbs such as PUT or DELETE 
 * in places where they are not supported
 */ 
var methodOverride = require('method-override')

/**
 * using custom logic to override method
 * 
 * there are other ways of overriding as well
 * like using header & using query value
 */ 
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

/**
 * This module shows flash messages
 * generally used to show success or error messages
 * 
 * Flash messages are stored in session
 * So, we also have to install and use 
 * cookie-parser & session modules
 */ 
var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser('keyboard cat'))
app.use(session({ 
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))
app.use(flash())


app.use('/', index)
app.use('/users', users)
const SERVER_PORT = process.env.SERVER_PORT || '3000'
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'http://127.0.0.1'
app.listen(SERVER_PORT, function(){
	console.log(`Server running at port ${SERVER_PORT}: ${SERVER_HOSTNAME}:${SERVER_PORT}`)
})
app.on('error', onError)

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
