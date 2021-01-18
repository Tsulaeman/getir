import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

import Record from './models/db';

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

app.post('/get-records', async (req, res) => {
  // console.log(req.body);
  const { startDate, endDate, minCount, maxCount } = req.body;
  const filterDate = {
    createdAt: {
      $gt: new Date(startDate),
      $lt: new Date(endDate)
    },
  };
  const filterCount = {
    totalCount: {
      $gt: minCount,
      $lt: maxCount
    }
  };
  const aggregation = [
    { $match: filterDate },
    {
      $project: {
        key : '$key',
        totalCount: {
          $sum: '$counts'
        },
        createdAt: "$createdAt",
      }
    },
    { $match: filterCount }
  ];
  const records = await Record.aggregate(aggregation).exec();
  // const records = await Record.findOne(); //(filter).exec();
  res.send(records);
});

app.listen(port, () => {
  console.log(`Getir app listening at http://localhost:${port}`);
});
