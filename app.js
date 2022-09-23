const express = require('express');
const app = express();
require('./db');
const authRoutes = require('./routes/authRoutes')
app.use(express.json());
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cors())
app.use(authRoutes);
app.use(cookieParser());


app.listen(5000); 