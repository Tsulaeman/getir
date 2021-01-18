import mongoose from 'mongoose';
import json from './schema.json';

const schema = new mongoose.Schema({
    ...json
});

export default mongoose.model('Record', schema);