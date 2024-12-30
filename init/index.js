const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


async function main ()
{
    await mongoose.connect("mongodb://localhost:27017/wanderlust");
}


main().then(() =>
{
    console.log("Connected to DB");
}).catch((err) =>
{
    console.log(err);
})

mongoose.set('debug', true);

const initDB = async () =>
{
await Listing.deleteMany({});

initData.data=  initData.data.map((obj) =>
{
   return ({...obj, owner : "676020100ca5b5cb5b2dcb89"});
});
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
}

initDB();
