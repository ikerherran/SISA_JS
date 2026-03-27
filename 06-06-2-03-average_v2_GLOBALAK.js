/*
1. Importatu MongoClient
2. Konexioa ezarri
3. Datuak atera
4. For batekin batu minutuak 
5. Batura eta emaitza erakutsi
BEREZITASUNA: ALDAGAI GLOBAL BAT DAGO NON DATUAK GORDEKO DIREN
*/

const { MongoClient } = require('mongodb');

let batura = 0;
let batazbeste=0;
let results = [];
//------------------------------------------------------------------------------
async function datuakAtera() {
    const client = new MongoClient("mongodb://localhost:27017");  // Zerbitzarira konexioa

    try {
        await client.connect();
        const db = client.db('web-navigation');  // datubasearen izena
        const collection = db.collection('traffic_logs'); // bildumaren izena

        // Orain query-a exekutatu eta array baten (results izena jarri diogu) gordeko dira emaitzak
        results = await collection.aggregate([
            { $match: { visitedWeb: "amazon.com"} },
            { $project: {_id:0,userIP:1,visitedWeb:1,durationMinutes:{$dateDiff:{startDate:"$startDateTime", endDate: "$endDateTime",unit: "minute"}} }}
        ]).toArray();  


    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

async function batura_kalkulatu() {
    batura = 0;
    for (let i = 0; i < results.length; i++) {
        batura += results[i].durationMinutes;
    }
}

async function batazbeste_kalkulatu() {
    if (results.length > 0) {
        batazbeste = batura / results.length;
    } else {
        batazbeste = 0;
    }
}

//-----------------PROGRAMA NAGUSIA-------------------------------------------------
async function main() {
    
    await datuakAtera();  // results aldagai globalean datubaseko datuak sartzen ditu
    await batura_kalkulatu(); // batura aldagai globalean batuketa gordetzen du
    await batazbeste_kalkulatu(); // batazbeste aldagai globalean batazbestekoa gordetzen du
    console.log("Batura:", batura);
    console.log("Batazbeste:", batazbeste);
}

// -------------EXEKUZIO AGINDUA
main();
