const { MongoClient } = require('mongodb');
const fs = require('fs');
//--------------------------------------------------------
async function datuakAteraCSV() {
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

//------------------------------------------------------------------
async function datuakAteraJSON() {
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
        fs.writeFileSync('offices_report.json', jsonContent);
        console.log(`Success! ${results.length} documents exported using aggregation.`);

    } catch (err) {
        console.error("Error details:", err);
    } finally {
        await client.close();
    }
}
//------------------------------------------
//-----------------PROGRAMA NAGUSIA-------------------------------------------------
async function main() {
    const format = process.argv[2];

    if (format === 'CSV') {
        await datuakAteraCSV();
    } else if (format === 'JSON') {
        await datuakAteraJSON();
    } else {
        console.log("Mesedez sartu argumentu egokia: 'node 06-07-CSV-JSON.js CSV' edo 'node 06-07-CSV-JSON.js JSON'");
    }
}

// -------------EXEKUZIO AGINDUA
main();