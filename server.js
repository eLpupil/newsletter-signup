require('dotenv').config();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


const https = require("https");

let port = process.env.PORT;
if (port == null || port =="") {
    port = "3000";
}

app.listen(port, () => {
    console.log(`Server listening on Port ${port}`);
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/failure" ,(req, res) => {
    res.redirect("/");
});


app.post("/", (req, res) => {

    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;

    let data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    let jsonData = JSON.stringify(data);
    const url = process.env.APIENDPOINT;

    const options = {
        method: "POST",
        auth: process.env.APIAUTH,
    }

    const request = https.request(url, options, (response) => {

        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data) => {
            // console.log(JSON.parse(data));
        });
        
        response.on("end", () => {
            console.log("No more data in response");
        });
    })

    request.on("error", (error) => {
        console.error(`problem with request: ${error.message}`);
    });

    request.write(jsonData);
    request.end();
});

