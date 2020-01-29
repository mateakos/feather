import path from 'path';
import express from 'express';
import { createServer } from 'http';
import io from './socket';

var webpack = require('webpack');
var webpackDevMiddleware =  require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('../../webpack.dev.config');


const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html'),
            compiler = webpack(config)

const server = createServer(app);

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}))

app.use(webpackHotMiddleware(compiler))

app.get('*', (req, res, next) => {
    compiler.outputFileSystem.req(HTML_FILE, (err, result) => {
        if (err){
            return next(err)
        }
        res.set('content-type', 'text/html')
        res.send(result)
        res.end()
    })
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {                                                                                                                                                                                                                                                                                                 
    console.log(`App listening to ${PORT}....`);
    console.log('Press Ctrl+C to quit.');
})

io(server);   

