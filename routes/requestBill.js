import express from 'express';
const router = express.Router();
import { authentication } from '../middlewares/authentication.js';
import { BillRequest } from '../models/bill.js';
import User from '../models/users.js';

router.get('/getAllShops', authentication, async (req, res) => {
  const userData = req.user;
  try {
    const shops = await User.find({ userType: 'shop' });
    if (shops) {
      res.status(200).send(shops);
    } else {
      res.status(204).send({ message: 'no shops found' });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: 'error occured' });
  }
});

router.post('/getShop', authentication, async (req, res) => {
  const params = req.body;

  try {
    const shop = await User.findOne({
      name: params.shopName,
      userType: 'shop',
    });
    if (shop) {
      res.status(200).send(shop);
    } else {
      res.status(204).send({ message: 'no shop found' });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: 'error occured' });
  }
});

router.post('/generateRequest', authentication, (req, res) => {
  const details = req.body.details;
  const billRequeast = new BillRequest({
    buyerName: details.customerName,
    buyerEmail: details.customerEmail,
    buyerLocationNumber: details.customerLocationNumber,
    buyerLocality: details.cutomerLocality,
    buyerState: details.customerState,
    buyerPincode: details.customerPincode,
    itemName: details.itemName,
    itemSerialNumber: details.itemSerialNumber,
    shopName: details.shopName,
    shopEmail: details.shopEmail,
    shopLocationNumber: details.shopLocationNumber,
    shopState: details.shopState,
    shopLocality: details.shopLocality,
    shopPincode: details.shopPincode,
  });
  billRequeast.save().then((re) => {
    if (re) {
      res.status(200).send(re);
    } else {
      res.status(400).send({ message: 'error occured' });
    }
  });
});

router.get('/pendingBill', authentication, async (req, res) => {
  const params = req.query;
  try {
    const pending = await BillRequest.find({
      shopName: params.name,
    });
    if (pending) {
      res.status(200).send(pending);
    } else {
      res.send({ message: 'No Pending Request' });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: 'error occured' });
  }
});
router.get('/allPendingBill', authentication, async (req, res) => {
  const user = req.user;
  try {
    let pendingRequest = await BillRequest.find({
      shopEmail: user.email,
    });
    if (pendingRequest) {
      res.status(200).send(pendingRequest);
    } else {
      res.status(204).send({ message: 'no bill found' });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: 'error occured' });
  }
});
// router.post('/confirmBill', authentication, (req, res) => {
//   const details = req.body.details;
//   console.log(details);
// });

export default router;
