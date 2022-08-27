import express from 'express';
import serveStatic from 'serve-static';
import { Properties } from './properties';

const expressApp = express();

expressApp.use(serveStatic(Properties.FRONTEND_BUILD_PATH, { index: false }));

expressApp.get('/*', (_httpRequest, httpResponse) => {
	httpResponse.sendFile(Properties.FRONTEND_BUILD_PATH + '/index.html');
});

expressApp.listen(Properties.SERVER_PORT, () => {
	console.log(`server started on port ${Properties.SERVER_PORT}`);
});
