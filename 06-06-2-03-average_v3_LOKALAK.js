/*
1. Importatu MongoClient
2. Konexioa ezarri
3. Datuak atera
4. For batekin batu minutuak 
5. Batura eta emaitza erakutsi
BEREZITASUNA: ALDAGAI GLOBAL BAT DAGO NON DATUAK GORDEKO DIREN
*/

const { MongoClient } = require('mongodb');

// Aldagaiak ez dira globalean definituko, funtzioen artean pasako dira
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
        
        return results;

    } catch (err) {
        console.error("Error:", err);
        return [];
    } finally {
        await client.close();
    }
}

async function batura_kalkulatu(results) {
    let batura = 0;
    for (let i = 0; i < results.length; i++) {
        batura += results[i].durationMinutes;
    }
    return batura;
}

async function batazbeste_kalkulatu(results, batura) {
    let batazbeste = 0;
    if (results && results.length > 0) {
        batazbeste = batura / results.length;
    }
    return batazbeste;
}
async function maximoa_kalkulatu(results) {
    let max = 0;
    if (results && results.length > 0) {
        max = results[0].durationMinutes;
        for (let i = 1; i < results.length; i++) {
            if (results[i].durationMinutes > max) {
                max = results[i].durationMinutes;
            }
        }
    }
    return max;
}

//-----------------PROGRAMA NAGUSIA-------------------------------------------------
async function main() {
    let results = await datuakAtera();
    let batura = await batura_kalkulatu(results);
    let batazbeste = await batazbeste_kalkulatu(results, batura);
    let maximoa = await maximoa_kalkulatu(results);
    
    console.log("Batura:", batura);
    console.log("Batazbeste:", batazbeste);
    console.log("Maximoa:", maximoa);
}

// -------------EXEKUZIO AGINDUA
main();
