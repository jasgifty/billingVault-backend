import mongoose from 'mongoose';

const billSchema = mongoose.Schema({
  buyerName: String,
  buyerEmail: String,
  buyerLocationNumber: String,
  buyerState: String,
  buyerLocality: String,
  buyerPincode: String,
  shopName: String,
  shopEmail: String,
  shopLocationNumber: String,
  shopState: String,
  shopLocality: String,
  shopPincode: String,
  itemName: String,
  itemSerialNumber: String,
  dateOfPurchase: String,
  price: String,
  warrentyStart: String,
  warrentyEnd: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
const Bill = mongoose.model('Bill', billSchema);
export const BillRequest = mongoose.model('bill-request', billSchema);
export const BillRecipt = mongoose.model('bill-recipt', billSchema);
export default Bill;
