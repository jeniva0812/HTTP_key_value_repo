const { read } = require('node:fs');
const net = require('node:net');

const server= net.createServer();



const clientData = new Map();
const id_vs_socket = new Map();
var isManager= false;
server.on('connection', (socket)=>{
    
    clientData.set(socket, { id: generateClientId(), data: {} });
    id_vs_socket.set(clientData.get(socket).id, socket);
    
    // console.log("Client connected");
    socket.on('data', (data)=>{
        
        
        const message= data.toString().trim().split('\n');
        
        console.log(message);

        
            for(let i=0;i<message.length;i++){
                if(message[i].toLowerCase()==='get'){
                    handleGet(socket,message[i+1],isManager);
                    i++;
                }
                else if(message[i].toLowerCase()=='m'){
                    isManager = true;
                }
                
                else if(message[i].toLowerCase()==='put'){
                    handlePut(socket,message[i+1],message[i+2]);
                    i=i+2;
                }
                
            }
            
            
        
        
        

    })
    socket.on('end',()=>{
        console.log("Client disconnected.");
    })
})

function handleGet(socket,str,isManager){
    const val= clientData.get(socket).data[str];
    
    if(!isManager){
        
        if(val!=undefined){
            socket.write(`Value for key "${str}":"${val}"\n`);
        }
        else{
            socket.write("<blank>\n");
        }
    }
    else if(isManager){
        let found= false;
        
        for(let [key,value] of clientData){
            
            
                for(let k in value.data){
                
                    if(k==str){
                        socket.write(`Value for key "${str}":"${value.data[k]}" found in client with id:"${value.id}" \n`);
                        found=true;
                    }
                }
             
            
        }
        if(!found){
            socket.write("<blank>\n");
        }
    }
    
}

function handlePut(socket,key,value){
    clientData.get(socket).data[key]=value;
    socket.write(`Key "${key}" set to "${value}"\n`);
}

function generateClientId() {
    return Math.floor(Math.random() * 1000);
}

const PORT= 3000;
server.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}.`);
});