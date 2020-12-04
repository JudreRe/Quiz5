const express = require("express");
const app = express();
const dblib = require("./dblib.js");
const path = require("path");
const multer = require("multer");
const upload = multer();

// Add middleware to parse default urlencoded form
app.use(express.urlencoded({ extended: false }));



// Setup EJS
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Enable CORS (see https://enable-cors.org/server_expressjs.html)
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

// Setup routes
// app.get("/", (req, res) => {
//     //res.send("Root resource - Up and running!")
//     res.render("index");
// });


app.get("/", async (req, res) => {
    // Omitted validation check
    const totRecs = await dblib.getTotalRecords();
    //Create an empty product object (To populate form with values)
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
    // Omitted validation check
    //  Can get this from the page rather than using another DB call.
    //  Add it as a hidden form value.
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