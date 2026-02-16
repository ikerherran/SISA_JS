const { MongoClient } = require('mongodb');
const fs = require('fs');

async function runReport() {
    const client = new MongoClient("mongodb://localhost:27017");

    try {
        await client.connect();
        const db = client.db('offices_2026'); 
        const collection = db.collection('offices_temp_humidity');

        // The aggregation: save all data in an array (results)
        const results = await collection.aggregate([
            { $group: { _id: "$officeId", count: { $sum: 1 }, avgTemp: { $avg: "$temperature" } } },
            { $sort: { count: -1 } }
        ]).toArray(); 
        console.log(results);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

runReport();