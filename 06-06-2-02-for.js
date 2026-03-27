/*
1. Importatu MongoClient
2. Konexioa ezarri
3. Datuak atera
4. For batekin batu minutuak 
5. Batura eta emaitza erakutsi
*/

const { MongoClient } = require('mongodb');

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

        let batura = 0;
        for (let i = 0; i < results.length; i++) {
            
            batura= batura+results[i].durationMinutes;
        }
        console.log("Batura:", batura);

      //  console.log(results);  // pantailan array-aren edukia erakutsi
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}
//------------------------------------------------------------------------
// Orain sortu berri dugun funtzioa exekutatuko dugu.
datuakAtera();
