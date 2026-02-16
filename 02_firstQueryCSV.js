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

        // CSV fitxategia izango den horretan, goiburua idatzi: Office ID,Avg temp
        var csvContent = "Office ID,Avg temp\n";

        //  Emaitza array baten dagonez, lerro bakoitzeko datuak CSV-ari gehituko zaikio array-a rekorritzen.
        for (var i = 0; i < results.length; i++) {
            var row = results[i];
            csvContent = csvContent + row._id + "," + row.avgTemp + "\n";  // hemen lerro berria gehitzen da, adib: B01-OFFICE-02,19.51386
        }

        // Orain fitxategi baten gorde csvContent-en daukagun dena,
        fs.writeFileSync('offices_report.csv', csvContent);
        console.log("Done! File saved as offices_report.csv");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

datuakAtera();