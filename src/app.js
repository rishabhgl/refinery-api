require('dotenv').config()
const path = require('path')
const express = require('express')
const hbs = require('hbs')

//session is connection to neo4j, client is connection to timescale
const { session, client, connectionError } = require('./database')
const {refineryRouter} = require('./routers/refinery')
const {sensorRouter} = require('./routers/sensors')
const views = path.join(__dirname, '../public/views')

const app = express()

app.set('view engine', 'hbs')
app.set('views', views)
app.use(express.static("public", { extensions: ['html']}))
app.use(express.json())
app.use(refineryRouter)
app.use(sensorRouter)

const PORT = process.env.PORT || 3000

app.get("/", async (req, res) => {
    const message = connectionError ? "Having trouble connecting to the database!": "Successfully connected to Knowledge graph and Sensors!"
    res.render("index", { title: "Home Page", message })
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