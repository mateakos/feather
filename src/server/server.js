var path = require('path')
var express = require('express')
import { createServer } from 'http'
import io from './socket'

var dev = process.env.NODE_ENV !== 'production';

if (dev) {
    var webpackDevMiddleware = require('webpack-dev-middleware');
    var webpackHotMiddleware = require('webpack-hot-middleware');
    var webpack = require('webpack');
    var config = require('../../webpack.dev.config');
}
 
const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html')

const server = createServer(app);

if (dev){
    const compiler =  webpack(config);

    app.use(webpackDevMiddleware(compiler, {
        hot: true,
        noInfo: true,
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
}

app.use(express.static(DIST_DIR))

app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
})

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})

io(server);