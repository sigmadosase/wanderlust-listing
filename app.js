const express=require("express");
const app=express();
const mongoose=require("mongoose");
const listing=require("./model/listing.js");
const path= require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapasync.js");
const ExpressError =require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const  Review =require("./model/reviews.js");

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


app.set("view engine","ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));

app.use(methodOverride("_method"));

app.engine("ejs",ejsMate);

app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("Hi man How are you ");
})

const validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errorMessage=error.details.map((el)=> el.message).join(",");
       throw new ExpressError(400,errorMessage);
    }else{
        next();
    }

}


// index rout 
app.get("/listings",  wrapAsync(async (req,res)=>{
  const alllisting= await  listing.find({});
  res.render("listings/index.ejs",{alllisting});
}));
 



// new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});


//show route
   
app.get("/listings/:id" , wrapAsync(async (req,res)=>{
    let {id}= req.params;
     const listingAll=await listing.findById(id);
     res.render("listings/show.ejs",{listingAll});
}));


//creat route 

app.post("/listings", 
    validateListing,
     wrapAsync(async(req,res,next)=>{
  const newlisting =new listing (req.body.listing);
 await newlisting.save();
res.redirect("/listings");
}));


//edit route
 app.get("/listings/:id/edit",  wrapAsync(async(req,res,)=>{
    let {id}= req.params;
    const listingAll=await listing.findById(id);
  res.render("listings/edit.ejs",{listingAll});
 })
);

//update route

app.put("/listings/:id", validateListing, wrapAsync( async(req,res)=>{
    let {id}= req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
 res.redirect("/listings");  ///
}));
//  delete raut


app.delete("/listings/:id", wrapAsync( async(req,res)=>{
    let {id}= req.params;
  let deletelisting=  await listing.findByIdAndDelete(id);
  console.log(deletelisting);
 res.redirect("/listings");
})
);

//review
//post route

app.post("/listings/:id/reviews", async(req,res)=>{
    let Listnig= await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    Listnig.reviews.push(newReview);
    await newReview.save();
    await Listnig.save();
    console.log("new review saved");
    res.send(`/listings/${listing._id}`);
});


app.use((err,req,res,next)=>{
    let {statusCode=500, message="Somthing went wrong"} =err;
   res.status(statusCode).render("error.ejs",{message});
})

app.listen(8080,()=>{
    console.log("araman  server is listening on 8080");
});

