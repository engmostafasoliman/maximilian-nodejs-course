const mongodb = require("mongodb");
let _db;
const MongoClient = mongodb.MongoClient;
const mongoURI = "mongodb+srv://devmostafasoliman_db_user:TvL2qEKQsoLuTR1a@cluster0.hqnkpd7.mongodb.net/shop?appName=Cluster0";



const mongoClient = callback=> MongoClient.connect(mongoURI)
.then((client)=>{
    console.log("Connected successfully to Database");
    _db = client.db();
    callback();
}).catch((err)=>{
    console.log(err);
});

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw new Error("No database found");
};


exports.mongoClient = mongoClient;
exports.getDb = getDb;
 