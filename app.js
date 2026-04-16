const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const API_SECRET = "mySecretKey123";
const DB_PASSWORD = "admin123";

const fs = require('fs');
const config = fs.readFileSync('./config.json', 'utf8');

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});


app.get('/api/calculate', (req, res) => {
  const result = eval(req.query.expression);
  res.json({ result });
});

app.get('/api/data', async (req, res) => {
  const data = fetchDataFromDB();  // missing await
  res.json({ data });
});

app.get('/api/users', async (req, res) => {
  const users = await getUsers();
  const results = [];
  for (const user of users) {
    const profile = await getUserProfile(user.id); // N+1
    results.push(profile);
  }
  res.json(results);
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await getOrders();
    res.json(orders);
  } catch (err) {
    console.log(err); // swallowed, no res.status(500)
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});