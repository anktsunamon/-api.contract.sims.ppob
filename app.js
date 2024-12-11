const cors = require("cors");
const express = require('express');

const path = require('path');
const http = require('http');
const fs = require('fs');

const app = express();

app.disable('x-powered-by');
app.use(express.json({limit: '250mb'}));
app.use(express.static('assets/profile'));

const customConfig = require("./custom-config");

const publicAuthCorsOptions = {
    origin: function (origin, callback) {
        if (customConfig.origin.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}

const indexRoute = require('./routes/index');
app.set('trust proxy', true);
app.use('', cors(publicAuthCorsOptions), indexRoute);

app.use(function(req, res, next) {
    res.status(404);
    res.json({ message: 'Not Found.'});
});

app.use(function(err, req, res, next) {
    fs.appendFile(path.join(__dirname, 'error.log'), '['+new Date().toLocaleString()+'] '+err.stack+'\n', function (err) {
        if (err) {
            console.log(err);
            throw err;
        }
    });

    return res.status(err.status || 500).json({
        message: err.message
    });
});

const httpServer = http.createServer(app);
httpServer.listen({
    port: customConfig.port
});
httpServer.on('error', onError);
httpServer.on('listening', onListening);

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof customConfig.port === 'string'
        ? 'Pipe ' + customConfig.port
        : 'Port ' + customConfig.port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    let addr = httpServer.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
}