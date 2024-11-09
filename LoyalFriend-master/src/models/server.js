const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',  // For Gmail, but adjust according to your email provider
    auth: {
        user: 'klathika033@gmail.com', // Replace with your email
        pass: 'Lathika143143'   // Replace with your email password or an app-specific password
    }
});

// Endpoint to handle form submissions
app.post('/submit_order', (req, res) => {
    const { name, email, petName } = req.body;

    const mailOptions = {
        from: 'klathika033@gmail.com',
        to: 'klathika033@gmail.com',  // Replace with the admin’s email
        subject: 'New Pet Order Request',
        text: `Order Details:\n\nName: ${name}\nEmail: ${email}\nPet Name: ${petName}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Failed to send order');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Order submitted successfully');
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
