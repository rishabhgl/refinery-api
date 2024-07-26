require('dotenv').config()
const express = require('express')

//session is connection to neo4j, client is connection to timescale
const { session, client, connectionError } = require('./database')
const {refineryRouter} = require('./routers/refinery')
const {sensorRouter} = require('./routers/sensors')

const app = express()

app.use(express.json())
app.use(refineryRouter)
app.use(sensorRouter)

const PORT = process.env.PORT || 3000

app.get("/", async (req, res) => {
    if (connectionError){
        res.send({
            error: connectionError
        })
    } else{
        res.send({
            message: "Successfully connected to Knowledge graph and Sensors!"
        })
    }
    
})

app.listen(PORT, () => {
    console.log("Server listening at port " + PORT)
})

process.on('SIGINT', async () => {
    await session.close();
    await driver.close();
    await client.end()
    process.exit(0);
});