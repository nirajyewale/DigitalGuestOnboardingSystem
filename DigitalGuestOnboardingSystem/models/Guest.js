import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema({
    hotelName: { type: String, required: true },
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    address: { type: String, required: true },
    purpose: { type: String, required: true },
    stayFrom: { type: Date, required: true },
    stayTo: { type: Date, required: true },
    email: { type: String, required: true },
    idProof: { type: String, required: true },
}, { timestamps: true });

const Guest = mongoose.model('Guest', guestSchema);

export default Guest;
