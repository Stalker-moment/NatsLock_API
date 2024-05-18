var nodemailer = require('nodemailer');
var name = 'Muhammad Tier Sinyo Cahyo Utomo Suharjo';

var transporter = nodemailer.createTransport({
  host: 'mx3.mailspace.id',
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: 'noreply@natslock.site',
    pass: 'XXXXXXXXXXXXXX'
  }
});

// Fungsi untuk membuat kode OTP acak
function generateOTP() {
  var otp = '';
  for (var i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

var otp = generateOTP(); // Menghasilkan kode OTP

var mailOptions = {
  from: 'noreply@natslock.site',
  to: 'mfirmansaleh11@gmail.com',
  subject: 'Open Locker',
  html: `
  <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Open Locker Success</title>
<style>
    /* CSS Reset */
    body, h1, p, table, th, td {
        margin: 0;
        padding: 0;
    }
    
    /* Email Body Styles */
    body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        background-color: #f4f4f4;
        padding: 20px;
    }

    .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
    }

    h1 {
        color: #333;
        margin-bottom: 20px;
        text-align: center;
    }

    p {
        color: #666;
        margin-bottom: 20px;
        text-align: center;
    }

    .locker-info {
        margin-bottom: 20px;
        background-color: #ddd;
        border-radius: 10px;
        padding: 10px;
    }

    .locker-info table {
        width: 100%;
    }

    .locker-info th,
    .locker-info td {
        padding: 0px;
        text-align: left;
    }

    .footer {
        margin-top: 20px;
        background-color: #000;
        padding: 10px;
        border-radius: 0 0 10px 10px;
    }

    .footer p {
        color: #fff;
        text-align: center;
        font-size: 12px;
    }
    
    .footer a {
        color: #fff;
        font-weight: bold;
        text-decoration: none;
    }
</style>
</head>
<body>
    <div class="container">
        <h1>Open Locker Success</h1>
        <img src="https://natslock.my.id/file/assets/open.png" alt="Success Image" style="display: block; margin: 10px auto 20px; width: 20%; ">
        <p>Your locker open has been successfully completed.<br><strong>Don't forget your stuff & Close the Locker</strong></p>
        
        <div class="locker-info">
            <h2>Open Details:</h2>
            <table>
                <tr>
                    <th>User:</th>
                    <td>ANJAS MARA</td>
                </tr>
                <tr>
                    <th>Locker Number:</th>
                    <td>1</td>
                </tr>
                <tr>
                    <th>Temperature At:</th>
                    <td>30.7 °C</td>
                </tr>
                <tr>
                    <th>Humidity At:</th>
                    <td>50 %</td>
                </tr>
                <tr>
                    <th>Time:</th>
                    <td>11:07:56</td>
                </tr>
                <tr>
                    <th>Date:</th>
                    <td>1 Januari 2024</td>
                </tr>
            </table>
            <!-- Add more details as needed -->
        </div>
        
        <div class="footer">
            <p>© 2024 <a href="https://natslock.site"><strong>NatsLock</strong></a>. All rights reserved. |  <a href="https://instagram.com/xitmazekk">By XI TM A</a></p>
        </div>
    </div>
</body>
</html>
  `
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
