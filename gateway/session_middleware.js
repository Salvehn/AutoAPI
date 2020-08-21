let session = require('express-session');
let MongoDBStore = require('connect-mongodb-session')(session);
let store = new MongoDBStore({
  uri: 'mongodb://sessions:micro_sessions@10.5.50.70:27017/',
  collection: 'express_sessions'
});

// Catch errors
store.on('error', function(error) {
  console.log(error);
});
const session_middleware=require('express-session')({
  secret: 'securekey',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  resave: true,
  saveUninitialized: true
})

module.exports=session_middleware
