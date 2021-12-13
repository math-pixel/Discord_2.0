const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { MongoClient } = require('mongodb');
const chalk = require('chalk');
const mongoURL = 'mongodb://localhost:3001';
const client = new MongoClient(mongoURL);
const nameDB = 'nameDatabase';

async function main() {
    await client.connect;
    console.log('['+ chalk.red('+') + chalk.reset('] Connected'));
    const db = client.db(nameDB);
    const collection = db.collection('names');
}
    main().then(console.log).catch(console.error).finally(() => client.close);
//const chalk = require('chalk');

const port = 3000;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server })

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        wss.clients.forEach(function each(client) {
            if(client !== ws && client.readyState == WebSocket.OPEN) {
            	console.log(message.toString());
                client.send(message.toString());
            }
        });
    })

})

server.listen(port, function(){
    console.log(`Port; ${port}`)
})