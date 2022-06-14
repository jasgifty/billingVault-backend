import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import User from '../models/users.js';
import {
  authentication,
  generateToken,
} from '../middlewares/authentication.js';
// import mongoose from 'mongoose';

router.post('/signup', async (req, res) => {
  const userData = req.body;
  const hashPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const newUser = new User({
      name: userData.name,
      email: userData.email,
      password: hashPassword,
      locationNumber: userData.locationNumber,
      state: userData.state,
      locality: userData.locality,
      pincode: userData.pincode,
      userType: userData.userType,
    });
    newUser.save();
    const token = generateToken(userData.email, userData.userType);
    return res.status(200).send(token);
  } catch (err) {
    return res
      .status(400)
      .send({ message: 'Some error occoured plesase try again' });
  }
});

router.post('/login', async (req, res) => {
  const userData = req.body;
  // console.log(userData);
  const user = await User.findOne({
    email: userData.email,
    userType: userData.userType,
  });
  if (!user)
    return res.status(204).send({ message: 'Invalid Email or Password' });
  try {
    const validPassword = await bcrypt.compare(
      userData.password,
      user.password
    );
    if (validPassword) {
      const token = generateToken(userData.email, userData.userType);
      return res.status(200).send(token);
    } else {
      return res.status(204).send({ message: 'Invalid Email or Password' });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: 'Invalid Email or Password' });
  }
});

router.get('/getUser', authentication, async (req, res) => {
  const userData = req.user;
  try {
    let foundUser = await User.findOne({
      email: userData.email,
      userType: userData.userType,
    });
    if (foundUser) {
      res.status(200).send(foundUser);
    } else {
      res.status(400).send('some error occured');
    }
  } catch (err) {
    console.log('getUser error ' + err);
    res.status(400).send('some error occured');
  }
});

router.post('/getUserByEmail', authentication, async (req, res) => {
  const userData = req.user;
  const params = req.body;
  try {
    let foundUser = await User.findOne({
      email: params.findUserEmail,
    });
    if (foundUser) {
      res.status(200).send(foundUser);
    } else {
      res.status(400).send('some error occured');
    }
  } catch (err) {
    console.log('getUser error ' + err);
    res.status(400).send('some error occured');
  }
});

router.post('/edit-user', authentication, async (req, res) => {
  const userData = req.body;
  const oldData = req.user;
  const hashPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const newUser = new User({
      name: userData.name,
      email: userData.email,
      password: hashPassword,
      locationNumber: userData.locationNumber,
      state: userData.state,
      locality: userData.locality,
      pincode: userData.pincode,
      userType: userData.userType,
    });
    const updatedUser = await updateOne(
      { email: oldData.email, userType: oldData.userType },
      {
        $set: {
          name: userData.name,
          email: userData.email,
          password: hashPassword,
          locationNumber: userData.locationNumber,
          state: userData.state,
          locality: userData.locality,
          pincode: userData.pincode,
          userType: userData.userType,
        },
      }
    );
    const token = generateToken(userData.email, userData.userType);
    res.status(200).send(token);
  } catch (err) {
    res.status(400).send({ message: 'Some error occoured plesase try again' });
  }
});

router.get('/delete-user', authentication, async (req, res) => {
  const userData = req.user;
  const deleteUser = await User.deleteOne({
    email: userData.email,
    userType: userData.userType,
  });
  if (deleteUser) {
    res.status(200).send(deleteUser);
  } else {
    res.status(400).send({ message: 'Some error occoured plesase try again' });
  }
});

export default router;
