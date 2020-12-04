const express = require("express");
const app = express();
const dblib = require("./dblib.js");
const path = require("path");
const multer = require("multer");
const upload = multer();


app.use(express.urlencoded({ extended: false }));




app.set("view engine", "ejs");
app.set("views", __dirname + "/views");


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Application folders
app.use(express.static(path.join(__dirname, "public")));

// Start listener
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});



app.get("/", async (req, res) => {

    const totRecs = await dblib.getTotalRecords();
    
    const cars = {
        carvin: "",
        carmake: "",
        carmodel: "",
        carmileage: ""
    };
    res.render("index", {
        type: "get",
        totRecs: totRecs.totRecords,
        car: cars
    });
});

app.post("/", async (req, res) => {
  
    const totRecs = await dblib.getTotalRecords();

    dblib.findCar(req.body)
        .then(result => {
            res.render("index", {
                type: "post",
                totRecs: totRecs.totRecords,
                result: result,
                car: req.body
            })
        })
        .catch(err => {
            res.render("index", {
                type: "post",
                totRecs: totRecs.totRecords,
                result: `Unexpected Error: ${err.message}`,
                car: req.body
            });
        });
});