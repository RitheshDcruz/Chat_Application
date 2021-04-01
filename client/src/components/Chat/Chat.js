import React,{useState,useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css';
import Infobar from '../Infobar/Infobar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';
let socket;


function Chat({location}) {

const [name, setName]=useState('');
const [room, setRoom]=useState('');
const [message, setMessage]=useState('');
const [messages, setMessages ]=useState([]);
const [users, setUsers] = useState('');

const ENDPOINT='localhost:5000';

    useEffect (()=>{
        const {name, room}=  queryString.parse(location.search);
        setName(name);
        setRoom(room);
        socket=io(ENDPOINT);
        console.log(queryString.parse(location.search));
        console.log(`name is ${name} ${room}`);

        socket.emit('join',{name,room}, (error)=>{ console.log(error)});
        return ()=>{
            socket.emit('disconnect');
            socket.off();
        }
       

    },[ENDPOINT,location]);


    useEffect (()=>{
        socket.on('adminMessage', (message)=>{
            setMessages([...messages, message])
        });
     
    },[messages]);

    useEffect (()=>{
        socket.on("roomData", ( users ) => {
            setUsers(users);
            console.log(users);
          });
        
        
    },[users]);

    const sendMessage=(event)=>{
        event.preventDefault();
        if (message){
            socket.emit('userMessage' , message, ()=>setMessage(''));
        }
    }
    

    return (
        <div className="outerContainer">
            <div className="container">
                <Infobar room={room}/>
                <Messages messages={messages} name={name}/>
                <Input message={message}  setMessage={setMessage}  sendMessage={sendMessage}/>
            </div>
            <TextContainer users={users}/>
        </div>
    )
}

export default Chat
