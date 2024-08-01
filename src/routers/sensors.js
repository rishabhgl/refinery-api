const { session, client } = require('../database')
const normal = require('../normal.json')
const express = require('express')

const router = express.Router()

router.get('/api/sensor/:id/latest', async (req, res) => {

    const sensorId = parseInt(req.params.id) || 1
    const numReadings = parseInt(req.query.num) || 10
    try {
        const result = await session.run(`MATCH (s:Sensor {sensor_id: ${sensorId}})RETURN toLower(s.name)`);
        const tableName = result.records.map(record => record._fields[0]) + "_" + sensorId
        
        const records = await client.query(`SELECT * FROM ${tableName} ORDER BY time DESC LIMIT ${numReadings};`)
        // const rows = records.rows.map(row => { return {
        //     time: new Date(row.time).toUTCString(),
        //     acc_x: row.acceleration_x.toPrecision(5),
        //     acc_y: row.acceleration_y.toPrecision(5),
        //     acc_z: row.acceleration_z.toPrecision(5),
        //     acc_rms: row.acceleration_rms.toPrecision(5),
        //     amplitude: row.amplitude.toPrecision(5),
        //     frequency: row.frequency
        // }})
        const rows = records.rows.map(row => { return [
            new Date(row.time).toUTCString(), row.acceleration_x.toPrecision(5),
             row.acceleration_y.toPrecision(5),
             row.acceleration_z.toPrecision(5),
             row.acceleration_rms.toPrecision(5),
             row.amplitude.toPrecision(5),
             row.frequency
        ]})
        res.send(rows)
        
    } catch (error) {
        console.error('Error querying the database:', error);
        res.status(500).send({error: 'Error querying the database'});
    }
});

router.get('/api/sensor/:id/spikes', async (req, res) => {

    const sensorId = parseInt(req.params.id)
    const numReadings = parseInt(req.query.num) || 10
    const parameter = req.query.parameter || "acceleration_rms"

    try {
        const result = await session.run(`MATCH (s:Sensor {sensor_id: ${sensorId}})-[:MONITORS]-(e:Equipment) RETURN toLower(s.name), toLower(e.name)`);
        const [sensorName, equipmentName] = result.records.map(record => [record._fields[0], record._fields[1]])[0]
        const tableName = sensorName + "_" + sensorId
        
        const query = `SELECT * FROM ${tableName} WHERE ${parameter} > ${1.95 * parseFloat(normal[equipmentName][sensorName][parameter])} ORDER BY time DESC LIMIT ${numReadings};`
        const records = await client.query(query)

        // const rows = records.rows.map(row => { return {
        //     time: new Date(row.time).toUTCString(),
        //     acc_x: row.acceleration_x.toPrecision(5),
        //     acc_y: row.acceleration_y.toPrecision(5),
        //     acc_z: row.acceleration_z.toPrecision(5),
        //     acc_rms: row.acceleration_rms.toPrecision(5),   
        //     amplitude: row.amplitude.toPrecision(5),
        //     frequency: row.frequency
        // }})
        const rows = records.rows.map(row => { return [
             new Date(row.time).toUTCString(),
             row.acceleration_x.toPrecision(5),
             row.acceleration_y.toPrecision(5),
             row.acceleration_z.toPrecision(5),
             row.acceleration_rms.toPrecision(5),   
             row.amplitude.toPrecision(5),
             row.frequency
        ]})
        res.send(rows)
        
    } catch (error) {
        console.error('Error querying the database:', error);
        res.status(500).send({error: 'Error querying the database'});
    }
});

// router.get('/api/sensor/:id/spikes', async (req, res) => {

//     const sensorId = parseInt(req.params.id)
//     const numReadings = parseInt(req.query.num) || 10
//     const parameter = req.query.parameter || "acceleration_rms"

//     try {
//         const result = await session.run(`MATCH (s:Sensor {sensor_id: ${sensorId}})-[:MONITORS]-(e:Equipment) RETURN toLower(s.name), toLower(e.name)`);
//         const [sensorName, equipmentName] = result.records.map(record => [record._fields[0], record._fields[1]])[0]
//         const tableName = sensorName + "_" + sensorId
        
//         const query = `SELECT * FROM ${tableName} WHERE ${parameter} > ${1.95 * parseFloat(normal[equipmentName][sensorName][parameter])} ORDER BY time DESC LIMIT ${numReadings};`
//         const records = await client.query(query)

//         const rows = records.rows.map(row => { return {
//             time: new Date(row.time).toUTCString(),
//             acc_x: row.acceleration_x.toPrecision(5),
//             acc_y: row.acceleration_y.toPrecision(5),
//             acc_z: row.acceleration_z.toPrecision(5),
//             acc_rms: row.acceleration_rms.toPrecision(5),   
//             amplitude: row.amplitude.toPrecision(5),
//             frequency: row.frequency
//         }})
//         res.send(rows)
        
//     } catch (error) {
//         console.error('Error querying the database:', error);
//         res.status(500).send({error: 'Error querying the database'});
//     }
// });


module.exports = {
    sensorRouter: router
}