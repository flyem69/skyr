import express from 'express';
import fs from 'fs';
import https from 'https';
import serveStatic from 'serve-static';
import { ExpressPeerServer } from 'peer';
import { Properties } from './properties';
import { Server } from 'socket.io';
import { StreamsService } from './services/streams-service';

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
expressApp.use(peerServer);

expressApp.get('/*', (_httpRequest, httpResponse) => {
	httpResponse.sendFile(Properties.FRONTEND_BUILD_PATH + '/index.html');
});

// todo update parameters
socketServer.on('connection', (socket) => {
    socket.on('disconnect', () => {
        StreamsService.delete(socket.id)
    });
    socket.on('joinStream', (streamId, userId) => {
        if (socket.id !== streamId) {
            socket.join(streamId)
        }
        socket.to(streamId).emit('viewerJoining', userId)
    });
    socket.on('leaveStream', (streamId, userId) => {
        socket.to(streamId).emit('viewerLeaving', userId)
        if (socket.id !== streamId) {
            socket.leave(streamId)
        }
    });
    socket.on('startStream', (author) => {
        StreamsService.add(socket.id, author)
    });
    socket.on('endStream', () => {
        StreamsService.delete(socket.id)
    });
});

httpServer.listen(Properties.SERVER_PORT, () => {
	console.log(`server started on port ${Properties.SERVER_PORT}`);
});
