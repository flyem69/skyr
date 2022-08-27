import express from 'express';

const expressApp = express();

expressApp.get('/*', (_httpRequest, httpResponse) => {
    httpResponse.send('Hello world!');
});

expressApp.listen(80, () => console.log('server started'));
