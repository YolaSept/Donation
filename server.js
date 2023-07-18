const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const port = 3000;

// MongoDB connection string
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Register route
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/registration.html');
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    await client.connect();
    const database = client.db('mydb');
    const usersCollection = database.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      res.send('<script>alert("Email is already registered"); window.history.back();</script>');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user to the database
    await usersCollection.insertOne({ name, email, password: hashedPassword });

    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.send('Registration failed');
  }
});

// Check email route
app.post('/check-email', async (req, res) => {
  const { email } = req.body;

  try {
    await client.connect();
    const database = client.db('mydb');
    const usersCollection = database.collection('users');

    const existingUser = await usersCollection.findOne({ email });
    res.send({ exists: !!existingUser });
  } catch (error) {
    console.error(error);
    res.send({ exists: false });
  }
});

// Login route
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    await client.connect();
    const database = client.db('mydb');
    const usersCollection = database.collection('users');

    // Find user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      res.send('<script>alert("User not found"); window.location.href="/login";</script>');
      return;
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.send('<script>alert("Invalid password"); window.history.back();</script>');
      return;
    }

    res.redirect('/homepage');
  } catch (error) {
    console.error(error);
    res.send('Login failed');
  }
});


// Homepage route
app.get('/homepage', (req, res) => {
  res.sendFile(__dirname + '/public/homepage.html');
});

// WebSocket server
io.on('connection', socket => {
  console.log('A user connected.');

  // Receive donation event
  socket.on('donation', amount => {
    // Broadcast the donation amount to all connected clients
    io.emit('newDonation', amount);
  });

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected.');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
