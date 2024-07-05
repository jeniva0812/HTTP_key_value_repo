// const net = require('node:net');
// const readline = require('readline');
// const [serverHost, serverPort, ...commands]= process.argv.slice(2);
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   });
// const socket= net.createConnection({host: serverHost, port:serverPort},()=>{
//     console.log('Connected to server');
//     console.log(`Server address: ${socket.remoteAddress}:${socket.remotePort}`);
    
    
    
//     const commandString = commands.join('\n');
//     socket.write(commandString + '\n');
//     socket.end();
// })

// socket.on('data',(data)=>{
//     console.log(data.toString());
//     if(data.toString()=='Do you want to access guest data? (y/n): '){
//         rl.question('Do you want to access guest data? (y/n): ', (userInput) => {
//             socket.write(userInput);
//             rl.close();
//           });
//     }
// })

// socket.on('end',()=>{
//     console.log('Connection closed by server');
// })

// socket.on('error',(err)=>{
//     console.error(`Error: ${err.message}`);
// })
const net = require('node:net');

const [serverHost, serverPort, ...commands] = process.argv.slice(2);



const socket = net.createConnection({ host: serverHost, port: serverPort }, () => {
  console.log('Connected to server');
  console.log(`Server address: ${socket.remoteAddress}:${socket.remotePort}`);

  const commandString = commands.join('\n');
  socket.write(commandString + '\n');
  socket.end();
});


socket.on('data', (data) => {
  console.log(data.toString());
});

socket.on('end', () => {
  console.log('Connection closed by server');
});

socket.on('error',(err)=>{
    console.error(`Error: ${err.message}`);
})


