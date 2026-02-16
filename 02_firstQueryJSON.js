/*
* Queriaren emaitza JSON formatuan esportatuko da fitxategi batera, zuenean egin daiteke 
* transformazioa JSON.stringify erabiliz.
*/


const { MongoClient } = require('mongodb');
const fs = require('fs');

async function datuakAtera() {
    const client = new MongoClient("mongodb://localhost:27017");

    try {
        await client.connect();
        const db = client.db('offices_2026');
        const collection = db.collection('offices_temp_humidity');

        const results = await collection.aggregate([
            { $group: { _id: "$officeId", avgTemp: { $avg: "$temperature" } } },
            { $sort: { avgTemp: -1 } }
        ]).toArray();

        // Mongodb-tik atera dugun array-a zuzenean json-era bihurtu
        var jsonContent = JSON.stringify(results,null,2);  // null,2 jarrita formmatua 'politagoa' da.

        // Orain fitxategi baten gorde jsonContent-en daukagun dena
        fs.writeFileSync('offices_report.json', jsonContent);
        console.log("Done! JSON file created: offices_report.json");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

datuakAtera();