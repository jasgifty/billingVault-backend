import express from "express";
const router = express.Router();
import { authentication } from "../middlewares/authentication.js";
import Bill, { BillRecipt, BillRequest } from "../models/bill.js";

router.get("/allbills", authentication, async (req, res) => {
  const userData = req.user;
  try {
    let bills = await BillRecipt.find({
      buyerEmail: userData.email,
      // userType: userData.userType,
    });
    if (bills) {
      res.status(200).send(bills);
    } else {
      res.status(204).send({ message: "no bill found" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "error occured" });
  }
});
router.post("/data", authentication, async (req, res) => {
  const userData = req.user;
  const data = req.body;
  try {
    let bills = await BillRecipt.find({
      buyerEmail: userData.email,
      shopName: data.shopName,
      itemName: data.itemName,
    });
    if (bills) {
      res.status(200).send(bills);
    } else {
      res.status(204).send({ message: "no bill found" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "error occured" });
  }
});

// router.get('/pendingBill', authentication, (req, res) => {
//   const user = req.user;
//   const params = req.query;
//   try {
//     let pendingRequest = await BillRequest.findAll({
//       buyerName: params.customerName,
//       shopEmail: user.email,
//     });
//     if (pendingRequest) {
//       res.status(200).send(pendingRequest);
//     } else {
//       res.status(204).send({ message: 'no bill found' });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(400).send({ message: 'error occured' });
//   }
// });

// router.get('/allPendingBill', authentication, (req, res) => {
//   const user = req.user;
//   try {
//     let pendingRequest = await BillRequest.findAll({
//       shopEmail: user.email,
//     });
//     if (pendingRequest) {
//       res.status(200).send(pendingRequest);
//     } else {
//       res.status(204).send({ message: 'no bill found' });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(400).send({ message: 'error occured' });
//   }
// });

router.post("/confirmBill", authentication, async (req, res) => {
  const details = req.body.details;
  const billRecipt = new BillRecipt({
    buyerName: details.customerName,
    buyerEmail: details.customerEmail,
    buyerLocationNumber: details.customerLocationNumber,
    buyerLocality: details.cutomerLocality,
    buyerState: details.customerState,
    buyerPincode: details.customerPincode,
    itemName: details.itemName,
    itemSerialNumber: details.itemSerialNumber,
    price: details.itemPrice,
    warrentyStart: details.itemPurchaseDate,
    dateOfPurchase: details.itemPurchaseDate,
    warrentyEnd: details.itemWarrentytill,
    shopName: details.shopName,
    shopEmail: details.shopEmail,
    shopLocationNumber: details.shopLocationNumber,
    shopState: details.shopState,
    shopLocality: details.shopLocality,
    shopPincode: details.shopPincode,
  });
  billRecipt.save();
  const deletedBill = await BillRequest.deleteOne({
    buyerEmail: details.customerEmail,
    itemName: details.itemName,
    itemSerialNumber: details.itemSerialNumber,
    shopEmail: details.shopEmail,
  });
  if (deletedBill) {
    res.status(200).send(deletedBill);
  } else {
    res.status(400).send({ message: "error occured" });
  }
});
router.post("/shopBillByCustomer", authentication, async (req, res) => {
  const user = req.user;
  const data = req.body;
  try {
    let bill = await BillRequest.find({
      buyerName: data.customerName,
      shopEmail: user.email,
    });
    if (bill) {
      res.status(200).send(bill);
    } else {
      res.status(204).send({ message: "no bill found" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "error occured" });
  }
});

router.post(
  "/confirmedShopBillByCustomer",
  authentication,
  async (req, res) => {
    const user = req.user;
    const data = req.body;
    try {
      let bill = await BillRecipt.find({
        buyerName: data.customerName,
        shopEmail: user.email,
      });
      if (bill) {
        res.status(200).send(bill);
      } else {
        res.status(204).send({ message: "no bill found" });
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: "error occured" });
    }
  }
);

router.get("/allShopBills", authentication, async (req, res) => {
  const userData = req.user;
  try {
    let bills = await BillRecipt.find({
      shopEmail: userData.email,
    });
    if (bills) {
      res.status(200).send(bills);
    } else {
      res.status(204).send({ message: "no bill found" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "error occured" });
  }
});

export default router;
