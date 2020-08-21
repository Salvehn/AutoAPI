const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useNewUrlParser: true,useUnifiedTopology: true  });
let Monitor = (log)=>{
  mongoClient.connect(function(err, client){
      const db = client.db("monitordb");
      const collection = db.collection("status");
      collection.insertOne(log, function(err, result){
          if(err){
              return console.log(err);
          }
          console.log(result.ops);
          client.close();
      });
  });
}
module.exports=Monitor
