const express = require('express');
const socketio= require('socket.io');
const http =require('http');
const router= require('./router');
const  cors = require('cors')
const {addUser,removeUser,getUser,getUsersInRoom}= require('./user')



const PORT=process.env.PORT|| 5000;

const app= express();
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });
//app.use(cors())
const server=http.createServer(app);

const io= socketio(server);

app.use(router);
io.on('connection', (socket) =>{
  
    console.log(`We have a connection ${socket.id}`);

    socket.on('join', (obj, callback)=>{
       
        console.log(`Username ${obj.name} is joining ${obj.room}`);
        const {error, user}=addUser({id : socket.id,name :obj.name,room:obj.room});
        console.log(user);
        if(error)return callback(error);

        socket.emit('adminMessage', { user: 'admin', text :`Welcome ${user.name} to the room ${user.room}`});
        if(user.room){
        socket.broadcast.to(user.room).emit('adminMessage',{ user:'admin', text:`${user.name} has joined the room`});
        }
        socket.join(user.room);

        if(user.room){
            users= getUsersInRoom(user.room);
            io.to(user.room).emit('roomData',{room: user.room, users })
            console.log(users);
            console.log("@@@@@@@@@@@@@@@@@@@@@@ emitted roomdata");
        }
       // callback();

    });
    socket.on('userMessage', (message,callback)=>{
       const user= getUser(socket.id);
       console.log(user);
       if (user){
       io.to(user.room).emit('adminMessage',{user: user.name,  text:message} );
    }
       callback();
    });
    socket.on('disconnect',()=>{

       const user= removeUser(socket.id);
       console.log(user);
        if(user){
            io.to(user.room).emit('adminMessage',{user: 'admin', text:`${user.name} has left the room`})
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
           // console.log("@@@@@@@@@@@@@@@@@@@@@@ emitted roomdata");
        }
        console.log('User has left!!!');
    });
});


server.listen(PORT, 
    ()=> console.log(`server is running on port ${PORT}`));