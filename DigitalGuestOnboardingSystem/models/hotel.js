import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    logo: { type: String, required: true },  // Path to the logo image
    qrCode: { type: String, required: true },  // QR code URL
});

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
