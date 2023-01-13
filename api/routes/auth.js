const router = require("express").Router();
const User = require("../models/User");

const bcrypt = require("bcrypt");

//register
router.post("/register", async (req, res) => {
  //    const user=new User({
  //     username:"Sankha",
  //     email:"sankha@gmail.com",
  //     password:"123456"
  //    })
  //    await user.save()
  //    res.send("ok")

  try {
    //generate ne password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      city:req.body.city,
      country:req.body.country,
      desc:req.body.desc,
      phone:req.body.phone
    });

    //save user and return response
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).send("user not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("wrong password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
