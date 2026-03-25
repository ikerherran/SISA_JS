/*
1. Importatu MongoClient
2. Konexioa ezarri
3. Datuak atera
4. For batekin batu minutuak 
5. Batura eta emaitza erakutsi
BEREZITASUNA: ALDAGAI GLOBAL BAT DAGO NON DATUAK GORDEKO DIREN
*/

const { MongoClient } = require('mongodb');
//const fs = require('fs');

let batura = 0;

//------------------------------------------------------------------------------
async function datuakAtera() {
    const client = new MongoClient("mongodb://localhost:27017");  // Zerbitzarira konexioa

    try {
        await client.connect();
        const db = client.db('web-navigation');  // datubasearen izena
        const collection = db.collection('traffic_logs'); // bildumaren izena

        // Orain query-a exekutatu eta array baten (results izena jarri diogu) gordeko dira emaitzak
        const results = await collection.aggregate([
            { $match: { visitedWeb: "amazon.com"} },
            { $project: {_id:0,userIP:1,visitedWeb:1,durationMinutes:{$dateDiff:{startDate:"$startDateTime", endDate: "$endDateTime",unit: "minute"}} }}
        ]).toArray();  

        // 'batura' aldagai globala 0-ra hasieratu
        batura = 0;
        // 'results' array-ko elementu bakoitzetik pasatu for erabiliz
        for (let i = 0; i < results.length; i++) {
            // Dagokion elemetuko minutu horiek baturari gehitu 
            batura += results[i].durationMinutes;
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}
//-----------------PROGRAMA NAGUSIA-------------------------------------------------
async function main() {
    await datuakAtera();
    console.log("Batura:", batura);
}

// -------------EXEKUZIO AGINDUA
main();
