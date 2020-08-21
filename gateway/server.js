
let port=process.argv[2]

if(typeof port=='undefined'){
    console.log('Missing port parameter')
    process.exit(0)
}

const express=require('express')
const bodyParser=require('body-parser')
const app = express();
const server = require('http').Server(app);

const cors = require('cors')
let session = require('express-session');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
const io = require('socket.io')(server);
const dbs=process.argv[3].split(' ')
const postRequest = require('./postRequest')(io,dbs);
const session_middleware=require('./session_middleware')


app.use(session_middleware);


app.use(express.json());
server.listen(port)
app.use('/api', postRequest);



console.log('Server started')
