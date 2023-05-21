const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()


app.use(cors())
app.use(express.json());



console.log(process.env.DB_USER, process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dvkslcl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

    const toyCollection = client.db('Toy-cars').collection('Toy-car');

    const BookingCollection = client.db('Toy-cars').collection('Toy-Bookings')

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    app.get('/alltoy', async (req, res) => {
      const cursor = toyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get('/alltoy/:id', async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) }

      const options = {
        projection: { title: 1, rating: 1, img: 1, price: 1, company: 1, details: 1, price: 1, model: 1 }
      }

      const result = await toyCollection.findOne(qurey, options);
      res.send(result)
    })





    app.get('/bookings', async (req, res) => {
      console.log(req.query.category);

      let query = {}
      if (req.query?.category) {
        query = { category: req.query.category }
      }

      const result = await toyCollection.find(query).toArray();
      res.send(result)

    })



    // new code end


    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      console.log(booking)
      const result = await BookingCollection.insertOne(booking);
      res.send(result)

    })





    // new code start
    app.delete('/bookings/:title', async (req, res) => {
      const title = req.params.title
      const query = { title: title };
      const result = await BookingCollection.deleteOne(query);
      res.send(result)
    })
    // new code end






    app.get('/bookings', async (req, res) => {

      const result = await BookingCollection.find().toArray();
      res.send(result);

    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }


  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }



}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('toy shope is open')
})
app.listen(port, () => {

  console.log(`toy-car is runing port : ${port}`)
})