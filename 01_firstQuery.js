const { MongoClient } = require('mongodb');
const fs = require('fs');

async function datuakAtera() {
    const client = new MongoClient("mongodb://localhost:27017");  // Zerbitzarira konexioa

    try {
        await client.connect();
        const db = client.db('airbnb');  // datubasearen izena
        const collection = db.collection('data'); // bildumaren izena

        // Orain query-a exekutatu eta array baten (results izena jarri diogu) gordeko dira emaitzak
        const results = await collection.aggregate([
            { $group: { _id: "$property_type", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
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
