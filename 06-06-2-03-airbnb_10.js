const { MongoClient } = require('mongodb');

let batura_txina = 0;
let batura_portugal = 0;
let results = [];
//------------------------------------------------------------------------------
async function datuakAtera() {
    const client = new MongoClient("mongodb://localhost:27017");  // Zerbitzarira konexioa

    try {
        await client.connect();
        const db = client.db('airbnb');  // datubasearen izena
        const collection = db.collection('data'); // bildumaren izena

        // Orain query-a exekutatu eta array baten (results izena jarri diogu) gordeko dira emaitzak
        results = await collection.aggregate([
            { $match: { $or: [{ "address.country": "Portugal" }, { "address.country": "China" }] } },
            {
                $group: {
                    _id: { country: "$address.country", property_type: "$property_type" },
                    count: { $sum: 1 } // Count accommodations
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the default _id field
                    country: "$_id.country",
                    property_type: "$_id.property_type",
                    count: 1
                }
            },
            {
                $sort: { country: 1 }
            }
        ]).toArray();  


    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

async function batura_kalkulatu() {
    batura_txina = 0;
    batura_portugal = 0;
    for (let i = 0; i < results.length; i++) {
        if (results[i].country === "China") {
            batura_txina += results[i].count;
        } else if (results[i].country === "Portugal") {
            batura_portugal += results[i].count;
        }
    }
}
//-----------------PROGRAMA NAGUSIA-------------------------------------------------
async function main() {
    
    await datuakAtera();  // results aldagai globalean datubaseko datuak sartzen ditu
    await batura_kalkulatu(); // batura aldagai globalean batuketa gordetzen du
  
    console.log("Batura_txina:", batura_txina);
    console.log("Batura_portugal:", batura_portugal);
}

// -------------EXEKUZIO AGINDUA
main();
