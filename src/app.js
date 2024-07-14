const express = require('express')
const neo4j = require('neo4j-driver')

const app = express()

const PORT = process.env.PORT || 3000

const uri = 'bolt://localhost:7687';
const user = 'neo4j';
const password = 'hello123';
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

app.get("/", (req, res) => {
    res.send({
        message:"Hello friends!"
    })
})

app.get('/api/facilities', async (req, res) => {
    try {
        const result = await session.run('MATCH (n:Facility) RETURN n.name');

        const records = result.records.map(record => record.get(0));

        res.json(records);
    } catch (error) {
        console.error('Error querying the database:', error);
        res.status(500).send('Error querying the database');
    }
});

app.get('/api/facilities/:id/equipment', async (req, res) => {

    const facilityId = parseInt(req.params.id)
    try {
        const result = await session.run(`MATCH (:Facility {facility_id: ${facilityId}})-[:CONTAINS]-(e:Equipment) RETURN e.name`);

        const records = result.records.map(record => record.get(0));

        res.json(records);
    } catch (error) {
        console.error('Error querying the database:', error);
        res.status(500).send('Error querying the database');
    }
});

app.listen(PORT, () => {
    console.log("Server listening at port " + PORT)
})

process.on('SIGINT', async () => {
    await session.close();
    await driver.close();
    process.exit(0);
});