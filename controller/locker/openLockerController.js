const express = require("express");
const fs = require("fs");
const router = express.Router();
const path = require("path");
const axios = require("axios");

const lockerdb = "./db/locker.json";
const userdb = "./db/user.json";
const rentdb = "./db/rent.json";
const systemdb = "./db/system.json";

//function 2 digit code
function generateCode() {
  return Math.floor(10 + Math.random() * 90);
}

router.post("/locker/request/open", (req, res) => {
  const { lockers, users } = req.body;

  if (!lockers || !users) {
    return res.status(400).json({ code: 400, message: "Invalid request" });
  }

  const lockerData = JSON.parse(fs.readFileSync(lockerdb, "utf8"));
  const userData = JSON.parse(fs.readFileSync(userdb, "utf8"));
  const rentData = JSON.parse(fs.readFileSync(rentdb, "utf8"));
  const systemData = JSON.parse(fs.readFileSync(systemdb, "utf8"));

  let method, metode, userss;
  if (typeof users === 'string' && users.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)) {
    method = "email";
    metode = "Email";
    userss = users;
  } else if (typeof users === 'string' && users.match(/^[0-9]+$/) && users.length <= 16) {
    method = "phone";
    metode = "Phone";
    userss = users;
  } else if (typeof users === 'string' && users.match(/^[0-9]+$/) && users.length === 20) {
    method = "uuid";
    metode = "UUID";
    userss = parseInt(users);
  } else {
    method = "username";
    metode = "Username";
    userss = users;
  }

  //check if user exist
  const user = userData.find((user) => user[metode] === userss);
  if (!user) {
    return res.status(404).json({ code: 404, message: "User not found" });
  }

  //check if locker exist
  if (lockers.match(/^[0-9]+$/) && lockers.length <= 2) {
    var locker_metode = "alias";
    var Methodlock = "Alias";
    var locker_value = `Locker_${lockers}`;
  } else if (lockers.match(/^[0-9]+$/) && lockers.length === 6) {
    var locker_metode = "uuid";
    var Methodlock = "UUID";
    var locker_value = lockers;
  } else {
    return res.status(400).json({ code: 400, message: "Invalid locker" });
  }

  const locker = lockerData.find(
    (locker) => locker[locker_metode] === locker_value
  );

  if (!locker) {
    return res.status(404).json({ code: 404, message: "Locker not found" });
  }

  const lockerfindsystem = systemData.Locker.find(
    (locker) => locker[Methodlock] === locker_value
  );

  if(lockerfindsystem.isOnline === false){
    return res.status(400).json({ code: 400, message: "Locker is Offline" });
  }

  //check if locker is available
  if (locker.state === true) {
    return res
      .status(400)
      .json({ code: 400, message: "Locker still available" });
  }

  //check OnGoing transaction
  if (locker.OnGoing.stats === true) {
    return res
      .status(400)
      .json({ code: 400, message: "Locker on going transaction other user" });
  }

  //check if user already rent locker
  const rent = rentData.find((rent) => rent.Username === user.Username);

  //check length of rent
  if (rent) {
    if (!rent.Rent.length > 0) {
      return res.status(400).json({
        code: 400,
        message: "You Not Rent Locker",
      });
    }

    locker.OnGoing.User.UUID = user.UUID;
    locker.OnGoing.User.Username = user.Username;
    locker.OnGoing.User.Email = user.Email;
    locker.OnGoing.User.Phone = user.Phone;
    locker.OnGoing.stats = true;
    //locker.justOpen = true;
    locker.OnGoing.code = generateCode().toString();
    locker.OnGoing.timestamp = Date.now();
    locker.OnGoing.expired = Date.now() + 120000; //added 2 minutes

    fs.writeFileSync(lockerdb, JSON.stringify(lockerData, null, 2));

    return res.status(200).json({
      code: 200,
      message: "Locker OnGoing Queue",
      data: {
        locker: locker.alias,
        user: user.username,
        unlock_code: locker.OnGoing.code,
        expired: locker.OnGoing.expired,
      },
    });
  } else {
    return res.status(400).json({ code: 400, message: "User not found" });
  }
});

module.exports = router;
