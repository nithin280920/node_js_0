require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.MONGODB_URL;

const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const dbName = 'learning_mongo';

async function main() {
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('user');

  const count = await collection.countDocuments();
  console.log(`Number of documents in the collection: ${count}`);

  const findResult = await collection.find({name: 'Alice'}).toArray();
    console.log('Found documents =>', findResult);

    // const insertResult = await collection.insertMany([
    //     { name: 'Alice', age: 28 },
    //     { name: 'Bob', age: 34 },
    //     { name: 'Charlie', age: 22 },
    // ]);
    // console.log('Inserted documents =>', insertResult);

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());