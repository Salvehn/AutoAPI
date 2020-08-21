const MongoClient = require("mongodb").MongoClient;



'use strict';

class DB {
  constructor(dbname,host='localhost:27017') {
    this.dbname = dbname;
    this.url = `mongodb://${host}/`;
    this.mongoClient = new MongoClient(this.url, { useNewUrlParser: true,useUnifiedTopology: true  });
  }
  create(object){
    let dbname=this.dbname
    return new Promise((resolve,reject)=>{
      this.mongoClient.connect(function(err, client){
        const db = client.db(`${dbname}db`);
        const collection = db.collection(dbname);
        collection.insertOne(object, function(err, result){
          if(err){
            //Monitor({module:'db',status:'error',err:err})
            return console.log(err);
          }
          resolve(result.ops)
        });
      });
    })
  }
  read(object){
    let dbname=this.dbname
    return new Promise((resolve,reject)=>{
      this.mongoClient.connect(function(err, client){
        const db = client.db(`${dbname}db`);
        const collection = db.collection(dbname);
        collection.find(object).toArray(function(err, result){
          if(err){
            //Monitor({module:dbname,status:'error',err:err})
            return console.log(err);
          }
          console.log(result);
          resolve(result)
          //client.close();
        });
      });
    })
  }
  update(query,set){
    let dbname=this.dbname
    return new Promise((resolve,reject)=>{
      this.mongoClient.connect(function(err, client){
        const db = client.db(`${dbname}db`);
        const collection = db.collection(dbname);
        collection.updateMany(query,{$set:set},function(err, result){
          if(err){
            //Monitor({module:dbname,status:'error',err:err})
            return console.log(err);
          }
          console.log(result);
          resolve(result)
          //client.close();
        });
      });
    })
  }
  delete(query){
    let dbname=this.dbname
    return new Promise((resolve,reject)=>{
      this.mongoClient.connect(function(err, client){
        const db = client.db(`${dbname}db`);
        const collection = db.collection(dbname);
        collection.deleteMany(query,function(err, result){
          if(err){
            //Monitor({module:dbname,status:'error',err:err})
            return console.log(err);
          }
          console.log(result);
          resolve(result)
          //client.close();
        });
      });
    })
  }

}



module.exports=DB



//Monitor({module:dbname,status:'success',err:null})
// console.log(db.fetch({id:1}))
