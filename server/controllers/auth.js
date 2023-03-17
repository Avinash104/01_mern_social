import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

/*REGISTER USER*/
// Register fuction for registering our users based on the data we are recieving from client

export const register = async (req, res) => {
  try {
    // Destructuring the req coming from the frontend
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body

    // Encrypting the password that we got
    const salt = await bcrypt.getSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    //Creating the new user with our client side values. notice that password will be replaced with the hash we created above
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    })

    const savedUser = await newUser.save()
    res.status(201).json(savedUser) //Sending the json back to frontend
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    //destructured email and pass, user is going to type in the login screen
    const { email, password } = req.body
    //search the unique user in the database
    const user = await User.findOne({ email: email })
    //if user not found in DB we will return error
    if (!user) return res.status(400).json({ msg: "User does not exist!" })
    //if password doesnt match the hash that was stored in DB, return error
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ msg: "Wrong Credentials!" })

    //creating jwt token that can be sent back for a secure login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    //deleting the password so we dont send it back with user data in the next step
    delete user.password
    //send back the jwt token with complete user data
    //this token will be compared back when a person tries to access the middleware
    res.status(200).json({ token, user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
