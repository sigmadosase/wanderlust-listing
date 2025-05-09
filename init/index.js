const mongoose=require("mongoose");

const initData =require("./data.js");
const listing=require("../model/listing.js");


const mongo_url="mongodb://127.0.0.1:27017/wanderlust";


main()
.then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(mongo_url);
}


const initDB=async()=>{
   await listing.deleteMany({});
   await listing.insertMany(initData.data);
   console.log("data was initialized");
}

initDB();