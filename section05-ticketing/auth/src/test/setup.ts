import {MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {app} from '../app';

let mongo:any;

beforeAll(async ()=>{
  process.env.JWT_KEY = 'adsopsdfisd';

  //OLD WAY
  // const mongo = new MongoMemoryServer();
  // const mongoUri = await mongo.getUri();
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

// await mongoose.connect(mongoUri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
  await mongoose.connect(mongoUri, {});
});

beforeEach(async ()=>{
  const collections = await mongoose.connection.db?.collections();

  if(collections){
    for(let collection of collections){
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});