    import express from 'express';
    import bodyParser from 'body-parser';
    import mongoose from 'mongoose';
    import bcrypt from 'bcrypt';
    import User from './models/userSchema.js';
    import Admin from './models/Schema1.js';
    import { v4 as uuidv4 } from 'uuid';
    import session from 'express-session';
    import hotelRoutes from './routes/hotelRoutes.js';
    import Hotel from './models/Hotel.js';
    import guestRoutes from './routes/guestRoutes.js'; 

    const app = express();

    app.use(session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Set true in production (HTTPS)
    }));
    app.use(express.json())
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({ extended: true }));

    (async () => {
        try {
            await mongoose.connect("mongodb://localhost:27017/todo");
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
        }
    })();


    app.set('views', './views');

    app.set('view engine', 'ejs');

    app.get('/', (req, res) => {
        console.log("Home Page");
        res.render('Home');
    });

    app.get('/about', (req, res) => {
        console.log("Info Page");
        res.render('Info');
    });

    app.use(guestRoutes);

    app.use('/hotel', hotelRoutes);

    app.get('/records', (req, res) => {
        const user = req.session.user; // Fetch from session
        if (!user || !user.uuid) {
            return res.status(400).send('User UUID not found');
        }
        res.render('records-ride', { uuid: user.uuid });
    });

    app.get('/hotels', async (req, res) => {
        try {
            const hotels = await Hotel.find(); // Fetch hotels from the database
            console.log("Hotels Customer Page");
            res.render('Customerhotel', { hotels }); // Pass hotels data to the template
        } catch (error) {
            console.error('Error fetching hotels:', error);
            res.status(500).send('Error loading hotels');
        }
    });

    app.get('/login', (req, res) => {
        console.log("Login Page");
        res.render('Login');
    });

    app.get('/contact', (req, res) => {
        console.log("Contact Page");
        res.render('Contact');
    });

    app.get('/abouthotel', async (req, res) => {
        try {
            const hotels = await Hotel.find(); // Assuming you have a Hotel model
            res.render('hotel', { hotels });
        } catch (error) {
            console.error('Error fetching hotels:', error);
            res.status(500).send('Error loading hotels');
        }
    });
    
    app.get('/signup', (req, res) => {
        console.log("Signup Page");
        res.render('Signup', { error: null });
    });

    app.get('/addhotel', (req, res) => {
        console.log("addHotel Page");
        res.render('addHotel', { error: null });
    });

    app.get('/profile', (req, res) => {
        const user = req.session.user; // Fetch from session
        if (!user || !user.uuid) {
            return res.status(400).send('User UUID not found');
        }
        res.render('profile', { username: user.username, uuid: user.uuid });
    });

    app.get('/adminlogin', (req, res) => {
        console.log("AdminLogin Page");
        res.render('Login1',{ error: null });
    });

    app.get('/hotel/register/:name', (req, res) => {
        const hotelName = req.params.name;
        // Fetch hotel data by name or perform any other logic
        Hotel.findOne({ name: hotelName })
            .then(hotel => {
                if (!hotel) {
                    return res.status(404).send('Hotel not found');
                }
                res.render('hotelDetails', { hotel });
            })
            .catch(error => {
                console.error('Error fetching hotel:', error);
                res.status(500).send('Error loading hotel details');
            });
    });    

    app.get('/adminsignup', (req, res) => {
        console.log("AdminSignup Page");
        res.render('Signup1', { error: null }); // Pass error as null initially
    });

    app.get('/profile1', (req, res) => {
        console.log("Admin Page");
        res.render('profile1');
    });

    // Signup route
    app.post("/signup", async (req, res) => {
        const { uname, psw } = req.body;

        try {
            if (!uname || !psw) {
                return res.status(400).send('Username and password are required.');
            }

            // Check if the user already exists
            const existingUser = await User.findOne({ uname });
            if (existingUser) {
                return res.status(400).send('User already exists. Please choose a different username.');
            }

            // Hash the password using bcrypt
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(psw, saltRounds);

            // Generate UUID for the new user
            const userUUID = uuidv4();

            // Create a new user with UUID
            const newUser = new User({
                uname,
                pwd: hashedPassword,
                uuid: userUUID // Add the UUID field
            });

            // Save the new user to the database
            await newUser.save();

            // Redirect or render login page after signup
            res.render('Login');
        } catch (error) {
            console.error('Error signing up user:', error);
            res.status(500).send('Error signing up user');
        }
    });



    app.post("/login", async (req, res) => {
        const { username, pwd } = req.body;
        try {
            const user = await User.findOne({ uname: username });

            if (!user) {
                return res.status(404).send('User not found');
            }

            const validPassword = await bcrypt.compare(pwd, user.pwd);
            if (!validPassword) {
                return res.status(401).send('Invalid password');
            }

            // Store user details in the session
            req.session.user = { uuid: user.uuid, username: user.uname };

            // Redirect to profile page
            res.render('Profile', { username: user.uname, uuid: user.uuid });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).send('Error logging in');
        }
    });

    // Middleware for logging requests
    app.use((req, res, next) => {
        console.log("Received request body:", req.body);
        next();
    });

    app.post("/adminlogin", async (req, res) => {
        const { duname, dpwd } = req.body;

        try {
            const admin = await Admin.findOne({ duname });

            if (!admin) {
                return res.status(404).send('Admin not found');
            }

            // Trim and normalize whitespace in the submitted password
            const submittedPassword = dpwd.trim();

            // Trim and normalize whitespace in the hashed password from the database
            const databasePassword = admin.dpwd.trim();

            // Log information for debugging
            console.log('Submitted password:', submittedPassword);
            console.log('Length of submitted password:', submittedPassword.length);
            console.log('Hashed password from database:', databasePassword);
            console.log('Length of hashed password from database:', databasePassword.length);
            console.log('Comparing passwords...');

            // Compare the passwords after converting both to the same format and encoding
            const validPassword = await bcrypt.compare(submittedPassword, databasePassword);

            // Log the result of the comparison
            console.log('Is password valid?', validPassword);

            // If passwords match
            if (validPassword) {
                console.log('Password is valid');
                await Admin.findByIdAndUpdate(admin._id, { available: true });
                res.render('profile1', { username: admin.duname });
            } else {
                console.log('Invalid password');
                res.status(401).send('Invalid password');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).send('Error logging in');
        }
    });

    app.post("/adminsignup", async (req, res) => {
        const { uname, psw } = req.body;

        try {
            if (!uname || !psw) {
                return res.status(400).send('Username and password are required.');
            }

            const existingAdmin = await Admin.findOne({ duname: uname });
            if (existingAdmin) {
                return res.status(400).send('Admin already exists. Please choose a different username.');
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(psw, saltRounds);

            const newAdmin = new Admin({
                duname: uname,
                dpwd: hashedPassword
            });
            console.log("Saving new Admin...");
            await newAdmin.save();
            console.log("Admin registered successfully!");
            res.render('Login1');
        } catch (error) {
            console.error('Error registering Admin:', error);
            res.status(500).send('Error registering Admin');
        }
    });

    app.use((req, res, next) => {
        console.log("Received request body:", req.body);
        next();
    });

    app.use((err, req, res, next) => {
        console.error('Error:', err);
        res.status(500).send(`Something broke! Error: ${err.message}`);
    });

    const PORT = 8001;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
