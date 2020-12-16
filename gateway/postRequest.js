
const express = require('express');
const router = express.Router();
const Monitor = require('./monitorFunc')
const session_middleware=require('./session_middleware')
const cote = require('cote');
const client = new cote.Requester({ name: 'server',namespace:'db' });
const sharedsession = require("express-socket.io-session");
module.exports = function(io,dbs) {
    const nsp = io.of('/ws')
    let connections = []
    nsp.use(sharedsession(session_middleware, {
        autoSave: true
    }));
    nsp.on("connection",function(ws){
        console.log("Server-Client Connected!");

        ws.on('connected', function(data) {
            if (ws.handshake.session && ws.handshake.session.user_id) {
                ws.join(ws.handshake.session.user_id)
                connections.push(ws);
                connections = connections.filter((elem, index, self) => self.findIndex(
                    (t) => { return (JSON.stringify(t.rooms) === JSON.stringify(elem.rooms)) }) === index)
                console.log('connected')
            }
        });
        ws.on('disconnecting',(data)=>{
            let self = this;
            let rooms = Object.keys(ws.rooms);
            connections.splice(connections.indexOf(ws), 1);
            connections = connections.filter((elem, index, self) => self.findIndex(
                (t) => { return (JSON.stringify(t.rooms) === JSON.stringify(elem.rooms)) }) === index)
            if (ws.handshake.session && ws.handshake.session.user_id) {
                ws.leave(ws.handshake.session.user_id)
                console.log(disconected)
            }
        })
        ws.on('join',(data)=>{
            console.log('joined',data)
            ws.join(data)
        })

    });
    router.post('/authenticate',async (req,res)=>{
        const payload = {
            type:`users_${'authenticate'}`,
            data: req.body
        };
        client.send(payload, (response) => {
            if(response.status){
                req.session.user_id = response.data.id
                return res.status(200).json({"text": "Unauthorized", "response": response.data});
            }else{
                return res.status(403).json({"text": "Unauthorized", "response": response});
            }
        });
    })

    router.post('/:method',async (req,res)=>{
        let result={}
        let query=req.body.query

    })
    router.post('/:instance/:method', async (req, res) => {
        console.log('request',req.params)
        if(dbs.includes(req.params.instance)){
            const payload = {
                type:`${req.params.instance}_${req.params.method}`,
                data: req.body
            };
            console.log(payload)
            client.send(payload, (response) => {
                return res.status(200).json({"text": "Success", "response": response});
            });
        }else{
            return res.status(200).json({"text": "Success", "response": 'no such db'});
        }

    });

    return router;

};
