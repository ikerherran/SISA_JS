/*
* Queriaren emaitza JSON formatuan esportatuko da fitxategi batera.
* Agregazioa erabiliz, datuak filtratu eta ordenatu ditugu.
*/
const { MongoClient } = require('mongodb');
const fs = require('fs');

async function datuakAtera() {
    const client = new MongoClient("mongodb://localhost:27017");

    try {
        await client.connect();
        const db = client.db('offices_2026');
        const collection = db.collection('pollution_data');

        // Aggregation pipeline definition
        const pipeline = [
            {
                // 1. Filter: extract only documents from 2026-02-11
                $match: {
                    timestamp: {
                        $gte: new Date("2026-02-11T00:00:00Z"),
                        $lt:  new Date("2026-02-12T00:00:00Z")
                    }
                }
            },
            {
                // 2. Sort: order by timestamp ascending
                $sort: { timestamp: 1 }
            }
        ];

        const results = await collection.aggregate(pipeline).toArray();

        // Bihurtu emaitza JSON formatura
        var jsonContent = JSON.stringify(results, null, 2); 

        // Gorde fitxategian
        fs.writeFileSync('pollution_20250211.json', jsonContent);
        console.log(`Success! ${results.length} documents exported using aggregation.`);

    } catch (err) {
        console.error("Error details:", err);
    } finally {
        await client.close();
    }
}

datuakAtera();