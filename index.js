const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uouce.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const reviewCollection = client.db('reviewDB').collection('review');
        const watchlistCollection = client.db('reviewDB').collection('watchlist');
        const gamesCollection = client.db("reviewDB").collection("upcomingGames");

        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await reviewCollection.findOne(query)
            res.send(result)
        })
        app.post('/review', async (req, res) => {
            const newReview = req.body;
            console.log(newReview)
            const result = await reviewCollection.insertOne(newReview);
            res.send(result)
        })
        app.post("/watchlist", async (req, res) => {
            const watchlistItem = req.body;
            console.log(watchlistItem)
            const result = await watchlistCollection.insertOne(watchlistItem);
            res.send(result);
        });

        app.get('/watchlist', async (req, res) => {
            const cursor = watchlistCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/watchlist/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await watchlistCollection.findOne(query)
            res.send(result)
        })
        app.delete('/watchlist/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await watchlistCollection.deleteOne(query)
            res.send(result)
        })
        app.put('/review/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedReview = req.body;
            const review = {
                $set: {
                    gameCover: updatedReview.gameCover,
                    gameTitle: updatedReview.gameTitle,
                    publishingYear: updatedReview.publishingYear,
                    rating: updatedReview.rating,
                    genre: updatedReview.genre,
                    reviewDescription: updatedReview.reviewDescription
                }
            }
            const result = await reviewCollection.updateOne(filter, review, options)
            res.send(result)
        })
        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
        })
        app.get("/upcomingGames", async (req, res) => {
            const cursor = gamesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Chill gamer server is running')
})
app.listen(port, () => {
    console.log(`Chill gamer running on port: ${port}`)
})