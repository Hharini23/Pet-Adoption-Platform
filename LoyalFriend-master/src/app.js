require('dotenv').config()
const express = require("express");
const app = express();
const path = require("path");
const multer = require('multer');
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const db = require("./db/conn");
const Register = require("./models/registers")
const hbs = require("hbs");
const Order = require('./models/order');
const bcrypt = require("bcrypt");
const router = express.Router();

const static_path = path.join(__dirname, "../public");
const view_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", view_path);
hbs.registerPartials(partials_path);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/", (req, res) => {
    res.render("login");
})
app.get("/login", (req, res) => {
    res.render("login");
})
app.get("/register", (req, res) => {
    res.render("register");
})
app.get("/index", (req, res) => {
    res.render("index");
})
app.get("/about", (req, res) => {
    res.render("about");
})
app.get("/blog", (req, res) => {
    res.render("blog");
})
app.get("/contact", (req, res) => {
    res.render("contact");
})
app.get("/breed/german", (req, res) => {
    res.render("breed/german");
})
app.get("/breed/labrador", (req, res) => {
    res.render("breed/labrador");
})
app.get("/breed/Rott", (req, res) => {
    res.render("breed/Rott");
})
app.get("/breed/golden", (req, res) => {
    res.render("breed/golden");
})
app.get("/breed/bulldog", (req, res) => {
    res.render("breed/bulldog");
})
app.get("/breed/beagle", (req, res) => {
    res.render("breed/beagle");
})
app.get("/cat/ragdoll", (req, res) => {
    res.render("cat/ragdoll");
})
app.get("/cat/maine", (req, res) => {
    res.render("cat/maine");
})
app.get("/cat/british", (req, res) => {
    res.render("cat/british");
})
app.get("/rabbit/american", (req, res) => {
    res.render("rabbit/american");
})
app.get("/rabbit/polish", (req, res) => {
    res.render("rabbit/polish");
})
app.get("/rabbit/pygmy", (req, res) => {
    res.render("rabbit/pygmy");
})
app.get("/organisation/posh", (req, res) => {
    res.render("organisation/posh");
})
app.get("/organisation/apolo", (req, res) => {
    res.render("organisation/apolo");
})


app.post("/register", async (req, res) => {
    try {
        const registerUser = new Register({
            username: req.body.username,
            phone: req.body.number,
            email: req.body.email,
            password: req.body.password
        })

        const registered = await registerUser.save();

        res.status(201).render("login");


    } catch (error) {
        res.render('404page', {
            errorMsg: "Opps! Data entered not valid, go back to try again..."
        })
    }
})
const storage = multer.memoryStorage(); // Store file in memory as Buffer
const upload = multer({ storage: storage });

// Define the route
app.post('/submit_order', upload.single('paymentScreenshot'), async (req, res) => {
    const { name, email, phone, address, petName } = req.body;
    if (!name || !email || !phone || !address || !petName) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const newOrder = new Order({
        name,
        email,
        phone,
        address,
        petName,
        paymentScreenshot: {
            data: req.file.buffer,
            contentType: req.file.mimetype
        }
    });

    try {
        await newOrder.save();
        res.status(201).json({ message: 'Order submitted successfully!' });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ message: 'Failed to submit order' });
    }
});


module.exports = router;



app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const loginemail = await Register.findOne({ email: email });
        const loginpass = await bcrypt.compare(password, loginemail.password);

        if (loginpass) {
            res.status(201).render("index");
        }
        else {
            res.send("Invalid details Entered");
        }

    } catch (err) {
        res.render('404page', {
            errorMsg: "Opps! Login Credentials mismatched, go back to try again..."
        })
    }
})

app.post("/submit_order", async (req, res) => {
    try {
        // Create a new order with data from the request body
        const newOrder = new Order({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address
        });

        // Save the order to the database
        await newOrder.save();
        res.status(201).send("Order submitted successfully!");
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).send("Failed to submit order. Please try again.");
    }
});
app.get("*", (req, res) => {
    res.render('404page', {
        errorMsg: "Opps! page not found, Click Here to go back"
    })
})



app.listen(port, () => {
    console.log(`listening on port ${port}`)
})