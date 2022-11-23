import express from 'express';
import fs from 'fs';
import https from 'https';
import serveStatic from 'serve-static';
import { ExpressPeerServer } from 'peer';
import { Properties } from './properties';
import { Server } from 'socket.io';
import { SocketEvent } from './enums/socket-event';
import { StreamService } from './services/stream-service';

const keyPath = __dirname + '/ssl/key.pem';
const certificatePath = __dirname + '/ssl/certificate.pem';

const expressApp = express();
const httpServer = https.createServer({
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certificatePath),
}, expressApp);
const socketServer = new Server(httpServer, {
	path: '/socket',
});
const peerServer = ExpressPeerServer(httpServer, {
	path: '/peer',
	port: Properties.SERVER_PORT,
    ssl: {
        key: fs.readFileSync(keyPath).toString(),
        cert: fs.readFileSync(certificatePath).toString(),
    },
});

expressApp.use(serveStatic(Properties.FRONTEND_BUILD_PATH, { index: false }));
expressApp.use(express.json())
expressApp.use(peerServer);

expressApp.get('/api/streams', (_httpRequest, httpResponse) => {
    httpResponse.json(StreamService.getAll());
});

expressApp.get('/*', (_httpRequest, httpResponse) => {
	httpResponse.sendFile(Properties.FRONTEND_BUILD_PATH + '/index.html');
});

socketServer.on(SocketEvent.CONNECTION, (socket) => {
    socket.on(SocketEvent.DISCONNECT, () => {
        StreamService.deleteIfExists(socket.id);
    });

    socket.on(SocketEvent.START_STREAM, (title: string) => {
        StreamService.create(socket.id, title);
    });
    socket.on(SocketEvent.END_STREAM, () => {
        StreamService.deleteIfExists(socket.id);
    });

    socket.on(SocketEvent.JOIN_STREAM, (socketId: string, peerId: string) => {
        if (socket.id !== socketId) {
            socket.join(socketId);
        }
        socket.to(socketId).emit(SocketEvent.VIEWER_JOINED, peerId);
    });
    socket.on(SocketEvent.LEAVE_STREAM, (socketId: string, peerId: string) => {
        socket.to(socketId).emit(SocketEvent.VIEWER_LEFT, peerId);
        if (socket.id !== socketId) {
            socket.leave(socketId);
        }
    });

    socket.on(SocketEvent.REQUEST_PREVIEW, (socketId: string, peerId: string) => {
        socket.to(socketId).emit(SocketEvent.PREVIEW_REQUESTED, peerId);
    });
    socket.on(SocketEvent.CLOSE_PREVIEW, (socketId: string, peerId: string) => {
        socket.to(socketId).emit(SocketEvent.PREVIEW_CLOSED, peerId);
    });
});

httpServer.listen(Properties.SERVER_PORT, () => {
	console.log(`server started on port ${Properties.SERVER_PORT}`);
});
