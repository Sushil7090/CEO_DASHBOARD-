const express = require('express');
const app = express();
require('dotenv').config();

const db = require('./database/models');

const routes = require('./src/routes/routes');

app.use(express.json());
app.use('/api', routes);

// Test DB connection
db.sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('DB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
