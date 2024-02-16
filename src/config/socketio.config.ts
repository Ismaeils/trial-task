import http from 'http';
import {Server, Socket} from 'socket.io';


function initiateEventListeners(io: Server) {
    // Handle socket connections
    io.use((socket: Socket, next) => {
        if(!socket.request.headers.authorization){
            next(new Error('Unauthenticated!'))
        }else{
            next();
        }
    });

    io.on('connection', (socket: Socket) => {
        const username = socket.request.headers.authorization;
        console.log(`New connection: ${username}!`);
        io.emit('general', `New connection: ${username}!`);

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`${username} has disconnected!`);
            io.emit('general', `${username} has disconnected!`);
        });
    });
}

export function initSocketServer(httpServer: http.Server): Server{
    const io = new Server(httpServer);
    initiateEventListeners(io);
    console.log('SocketIO Server is running')
    return io;
}