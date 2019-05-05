
const messaggio = require('../models/messaggio');

module.exports = function(io){
    users=[];
    connections=[];
    io.on('connection', function(socket){
        connections.push(socket);
        let rooms;

        socket.on('room', function(room) {
                rooms=room;
                socket.join(room);
            });
 
        socket.on('disconnect', function(){
            users.splice(users.indexOf(socket.username),1);
            connections.splice(connections.indexOf(socket),1);
        });
    
        socket.on('input', function(data){  
            let MITTENTE_id = data.mittenteid;
            let Data = data.data;
            let Testo = data.message;
            let COLLEGAMENTO_id = data.collegametoid;
            // Check for name and message
            if( Testo == ''){
                // Send error status
                io.sockets.emit('status', 'Please enter a message');
            } else {
                // Insert message
                messaggio.create({
                    Testo,
                    MITTENTE_id,
                    Data,
                    COLLEGAMENTO_id
                })
                io.sockets.in(COLLEGAMENTO_id).emit('output',[data]);
                io.sockets.in(COLLEGAMENTO_id).emit('status', 'Message sent'); 
            }
        });
    });
}