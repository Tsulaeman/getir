import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { body, validationResult} from 'express-validator';

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

app.post(
  '/get-records',
  body('startDate').isDate(),
  body('endDate').isDate(),
  body('minCount').isNumeric(),
  body('maxCount').isNumeric(),
  async (req, res) => {
  // Do request validation here and return response on error
  try{
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json(
        {
          code: 403,
          msg: "Unprocessable entity: Please enter the right values",
          errors: validationErrors.array()
        }
      );
    }
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
    res.send({
      code: 0,
      msg: 'Success',
      records
    });
  } catch (error) {
    res.status(500).json({
      code: error.code,
      msg: error.message,
    });
  }

});

app.listen(port, () => {
  console.log(`Getir app listening at http://localhost:${port}`);
});
