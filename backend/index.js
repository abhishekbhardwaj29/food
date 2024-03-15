const express = require('express');
const nodemailer = require('nodemailer');
const port = 5000;
const app = express();
const cors = require('cors');
require('../backend/db');
const FoodItem = require('../backend/Schema/food_item');
const FoodCategory = require('../backend/Schema/foodCategory');
const User = require('../backend/Schema/User')
app.use(express.json());
app.use(cors())

const jwt = require('jsonwebtoken');
const jwttoken = 'food'

const { body, validationResult } = require('express-validator');

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: "benny.pagac91@ethereal.email",
        pass: "TYQHdVTyGyTFsRfcje",
    },
});

app.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Create email content
    const mailOptions = {
        from: '"abhishek" <abhishekbhardwaj2909@gmail.com>', // sender address
        to: "sumitsinha896@gmail,com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    };

    try {
        // Send OTP via Nodemailer
        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
});

app.post('/createUser',
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    // password must be at least 5 chars long
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            let user = new User(req.body);
            let result = await user.save();
            result = result.toObject();
            delete result.password; // Corrected the deletion of the password property

            jwt.sign({ result }, jwttoken, { expiresIn: "48hr" }, (err, token) => {
                if (!err) {
                    res.send({ result, auth: token });
                } else {
                    console.error('Error:', err);
                    res.status(500).send({ err: "Internal Server Error" });
                }
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send({ err: "Internal Server Error" });
        }
    });


app.post('/loginUser', async (req, res) => {
    if (req.body.password && req.body.email) {
        try {
            let data = await User.findOne({ email: req.body.email, password: req.body.password }).select('-password');

            if (data) {
                jwt.sign({ data }, jwttoken, { expiresIn: "48hr" }, (err, token) => {
                    if (!err) {
                        res.send({ data, auth: token });
                    } else {
                        res.status(500).send({ err: "Internal Server Error" });
                    }
                });
            } else {
                res.status(404).send({ err: "Not Found" });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send({ err: "Internal Server Error" });
        }
    } else {
        res.status(400).send({ err: "Bad Request" });
    }
});

app.get('/foodItem', async (req, res) => {
    let data = await FoodItem.find()
    let data1 = await FoodCategory.find()
    res.send([data, data1])
})

app.listen(port, () => {
    console.log(`server is rendering on https://localhost:${port}`)
})