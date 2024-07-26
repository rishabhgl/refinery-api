require('dotenv').config()
const neo4j = require('neo4j-driver')
const { Client } = require('pg')
const { connectionString } = require('pg/lib/defaults')

const main = () => {
    try{
        const uri = process.env.NEO4J_URI
        const user = process.env.NEO4J_USER
        const password = process.env.NEO4J_PASSWORD
        const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
        const session = driver.session();
        
        const timescale_url = process.env.TIMESCALE_URL 
        const client = new Client({connectionString: timescale_url})
        client.connect()
        return { session, client }
    } catch(err){
        return { error }
    }
}

const { session, client, error:connectionError } = main()

module.exports = {
    session,
    client,
    connectionError
}