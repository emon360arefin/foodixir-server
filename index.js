const express = require('express')
const mongoose = require('mongoose');
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

// middleware
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())



// Route
app.get('/', (req, res) => {
    res.send('Foodixir')
})

app.use('/api/products', productRoute)



// Connect to Database
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to database");

        // Listen to port
        app.listen(process.env.PORT, () => {
            console.log('listening for requests on port', process.env.PORT)
        })
    })
    .catch((err) => {
        console.log(err)
    })



    



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const uri = `${process.env.MONGO_URI}`

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
})

async function run() {
    try {
        const usersCollection = client.db('foodixirDB').collection('users')
        const chefCollection = client.db('foodixirDB').collection('chef')
        const recipeCollection = client.db('foodixirDB').collection('recipe')
        const homecookCollection = client.db('foodixirDB').collection('homecook')
        const homecookrecipeCollection = client.db('foodixirDB').collection('hoomecookrecipe')
        const favoriteCollection = client.db('foodixirDB').collection('favorite')

        // Get User
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })


        // Saving User
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const query = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user
            }
            const result = await usersCollection.updateOne(query, updateDoc, options);
            console.log(result);
            res.send(result)
        })




        // CHEF


        // Get all chef
        app.get('/chef', async (req, res) => {
            const result = await chefCollection.find().toArray();
            res.send(result)
        });


        // Get Single Chef
        app.get('/chef/:chef', async (req, res) => {
            const chef = req.params.chef;
            const query = { name: chef }
            const result = await chefCollection.findOne(query);
            res.send(result)
        });



        // HOMECOOK

        // Get All Homecook

        app.get('/homecook', async (req, res) => {
            const result = await homecookCollection.find().toArray();
            res.send(result)
        });

        app.get('/homecook/:chef', async (req, res) => {
            const chef = req.params.chef;
            const query = { name: chef }
            const result = await homecookCollection.findOne(query);
            res.send(result)
        });


        // Get single homecook





        // Recipe

        // Get all recipe

        app.get('/recipe', async (req, res) => {
            const result = await recipeCollection.find().toArray();
            res.send(result)
        })


        // Get a single recipe
        app.get('/recipe/:chef', async (req, res) => {
            const chef = req.params.chef;
            const query = { chef: chef }
            const result = await recipeCollection.find(query).toArray();
            res.send(result)
        });



        // HOMECOOK RECIPE

        // Get Homecook Recipe 

        app.get('/homecookrecipe', async (req, res) => {
            const result = await homecookrecipeCollection.find().toArray();
            res.send(result)
        });


        // Get a single recipe for homecook

        app.get('/homecookrecipe/:chef', async (req, res) => {
            const chef = req.params.chef;
            const query = { homecook: chef }
            const result = await homecookrecipeCollection.find(query).toArray();
            res.send(result)
        });



        // FAVORITE

        // Fav get
        app.get('/favorite/:email', async (req, res) => {

            const email = req.params.email;
            const query = { email: email };
            const result = await favoriteCollection.findOne(query)
            res.send(result)
        })








        // Fav Put
        app.put('/favorite/:email', async (req, res) => {
            try {
                const email = req.params.email;  // Corrected from "params.email" to "req.params.email"
                const favorite = req.body;
                const query = { email: email };
                const options = { upsert: true };
                const updateDoc = {
                    $set: favorite,
                    $addToSet: { favoriteIds: favorite.id }  // Use $addToSet to add unique items to the array
                };
                const result = await favoriteCollection.updateOne(query, updateDoc, options);

                res.send(result)

                // if (result.modifiedCount > 0) {
                //     res.send({ success: true, message: 'Bookmark updated successfully.' });
                // } else if (upsertedCount > 0) {
                //     res.send({ success: true, message: 'Bookmark updated successfully.' })
                // } else {
                //     res.send({ success: false, message: 'Bookmark update failed.' });
                // }
            } catch (error) {
                console.error('An error occurred:', error);
                res.status(500).send({ success: false, message: 'Internal server error.' });
            }
        });


        // Send a ping to confirm a successful connection
        await client.db('admin').command({ ping: 1 })
        console.log(
            'Pinged your deployment. You successfully connected to MongoDB!'
        )
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Foodixir Server is running..')
})

app.listen(port, () => {
    console.log(`Foodixir  is running on port ${port}`)
})