const express = require('express')
const app = express();
var cors = require('cors')
const port = 5000;

app.use(cors());

const chef = require('./data/chef.json');
const recipe = require('./data/recipe.json');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/chef', (req, res) => {
    res.send(chef)
});

app.get('/recipe', (req, res) => {
    res.send(recipe)
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})