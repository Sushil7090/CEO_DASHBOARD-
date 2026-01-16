const express = require('express');
const app = express();
require('dotenv').config();

const db = require('./database/models');
const routes = require('./src/routes/routes');
const authenticateJWT = require('./src/middleware/auth.middleware');

app.use(express.json());

// PUBLIC ROUTES

app.use('/api', routes);   

// DB connection
db.sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('DB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
