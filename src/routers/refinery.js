const { session } = require('../database')
const express = require('express')

const router = express.Router()

router.get('/api/facilities', async (req, res) => {
    try {
        const result = await session.run('MATCH (n:Facility)-[:IS_FACILITY_TYPE]-(f:FacilityType) RETURN n.facility_id, n.name, n.manufacturer, n.status, f.name');

        const records = result.records.map(record => record._fields);

        res.json(records);
    } catch (error) {
        console.error('Error querying the database:', error);
        res.status(500).send('Error querying the database');
    }
});

router.get('/api/facilities/:id/equipment', async (req, res) => {

    const facilityId = parseInt(req.params.id)
    try {
        const result = await session.run(`MATCH (:Facility {facility_id: ${facilityId}})-[:CONTAINS]-(e:Equipment) RETURN e.name, e.equipment_id, e.status, e.manufacturer`);

        const records = result.records.map(record => record._fields);

        res.json(records);
    } catch (error) {
        console.error('Error querying the database:', error);
        res.status(500).send('Error querying the database');
    }
});

router.get('/api/equipment/:id/sensors', async (req, res) => {

    const equipmentId = parseInt(req.params.id)
    try {
        const result = await session.run(`MATCH (:Equipment {equipment_id: ${equipmentId}})-[:MONITORS]-(s:Sensor) RETURN s.name, s.sensor_id, s.parameter, s.frequency`);

        const records = result.records.map(record => record._fields);

        res.json(records);
    } catch (error) {
        console.error('Error querying the database:', error);
        res.status(500).send('Error querying the database');
    }
});

module.exports = {
    refineryRouter: router
}