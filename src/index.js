import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

import getRecords from './routes/get-records';


const app = express();
const port = 3000;

// Connection URI
const uri = process.env.DB_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
// Log database connection errors
db.on('error', console.error.bind(console, 'connection error:'));
// Log database connection success
db.once('open', function() {
  console.log("DB Connection success")
});

// Parse request body
app.use(express.json());

app.use('/get-records', getRecords);

app.listen(port, () => {
  console.log(`Getir app listening at http://localhost:${port}`);
});
