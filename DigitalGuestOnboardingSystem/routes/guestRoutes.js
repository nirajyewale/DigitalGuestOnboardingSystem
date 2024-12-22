import express from 'express';
import Guest from '../models/Guest.js';

const router = express.Router();

// Route to display all guests
router.get('/admin/guests', async (req, res) => {
    try {
        const guests = await Guest.find(); // Get all guest details
        res.render('guestAdminPanel', { guests });
    } catch (error) {
        console.error('Error fetching guests:', error);
        res.status(500).send('Error fetching guests');
    }
});

// Route to edit a guest's details
router.get('/admin/guest/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const guest = await Guest.findById(id);
        if (!guest) {
            return res.status(404).send('Guest not found');
        }
        res.render('editGuest', { guest });
    } catch (error) {
        console.error('Error fetching guest:', error);
        res.status(500).send('Error fetching guest');
    }
});

router.post('/admin/guest/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { fullName, mobileNumber, address, purpose, stayFrom, stayTo, email, idProof } = req.body;

    try {
        const updatedGuest = await Guest.findByIdAndUpdate(id, {
            fullName,
            mobileNumber,
            address,
            purpose,
            stayFrom,
            stayTo,
            email,
            idProof,
        }, { new: true });

        res.redirect('/admin/guests'); // Redirect back to the guests list
    } catch (error) {
        console.error('Error updating guest:', error);
        res.status(500).send('Error updating guest');
    }
});

// Route to view guest details
router.get('/admin/guest/view/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const guest = await Guest.findById(id);
        if (!guest) {
            return res.status(404).send('Guest not found');
        }
        res.render('viewGuest', { guest });
    } catch (error) {
        console.error('Error fetching guest:', error);
        res.status(500).send('Error fetching guest');
    }
});

export default router;
