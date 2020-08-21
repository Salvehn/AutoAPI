const Monitor = require('./monitorFunc')
let dbname=process.argv[2]
let host=process.argv[3]
if(typeof dbname=='undefined'){
    console.log('Missing databse name parameter')
    process.exit(0)
}

let dbclass = require('./dbprototype.js')
let db= new dbclass(dbname,host)
const cote = require('cote');
const dbService = new cote.Responder({ name: dbname,namespace:'db',respondsTo: [`${dbname}_create`,`${dbname}_read`,`${dbname}_update`,`${dbname}_delete`]});
console.log(`${dbname} database started`)

dbService.on(`${dbname}_read`,(req,cb)=>{
    console.log('read')
    db.read(req.data).then(dbdata=>{
        console.log(dbdata)
        cb(dbdata)
    })
})
dbService.on(`${dbname}_create`,(req,cb)=>{
    console.log('create')
    db.create(req.data).then(dbdata=>{
        console.log(dbdata)
        cb(dbdata)
    })
})
dbService.on(`${dbname}_update`,(req,cb)=>{
    console.log('update')
    db.update(req.data.query,data.set).then(db=>{
        console.log(dbdata)
        cb(dbdata)
    })
})
dbService.on(`${dbname}_delete`,(req,cb)=>{
    console.log('delete')
    db.delete(req.data).then(dbdata=>{
        console.log(data)
        cb(dbdata)
    })
})
