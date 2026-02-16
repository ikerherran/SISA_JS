const { MongoClient } = require('mongodb');

async function datuakAtera() {
    const client = new MongoClient("mongodb://localhost:27017");  // Zerbitzarira konexioa

    try {
        await client.connect();
        const db = client.db('offices_2026');  // datubasearen izena
        const collection = db.collection('offices_temp_humidity'); // bildumaren izena

        // Orain query-a exekutatu eta array baten (results izena jarri diogu) gordeko dira emaitzak
        const results = await collection.aggregate([
            { $group: { _id: "$officeId", avgTemp: { $avg: "$temperature" } } },
            { $sort: { avgTemp: -1 } }
        ]).toArray();  
        console.log(results);  // pantailan array-aren edukia erakutsi
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}
// Orain sortu berri dugun funtzioa exekutatuko dugu.
datuakAtera();
