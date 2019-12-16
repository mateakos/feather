const io = require('socket.io');
import Users from './users';

/**
 * Initialize when a connection is made
 * @param {SocketIO.Socket} socket
 */
function initSocket(socket){
    let id;
    socket
        .on('init', async() => {
            id = await Users.create(socket);
            console.log(`New socket connection initialized ${id}`);
            socket.emit('init', { id });
        })
        .on('request', (data) => {
            const receiver = Users.get(data.to);
            console.log(`Request from ${data.to}`);
            if(receiver){
                receiver.emit('request', { from: id });
            }
        })
        .on('call', (data) => {
            const receiver = Users.get(data.to);
            console.log(`Call from ${data.to}`);
            if (receiver) {
                receiver.emit('call', { ...data, from: id});
            } else {
                console.log(`Call failed ${data.to}`);
                socket.emit('failed');
            }
        })
        .on('end', (data) => {
            console.log(`Call ended from ${data.to}`);
            const receiver = Users.get(data.to);
            if (receiver) {
                receiver.emit('end');
            }
        })
        .on('disconnect', () => {
            Users.remove(id);
            console.log(id, 'disconnected');
        })
}

export default (server) => {
    io
      .listen(server, { log: true })
      .on('connection', initSocket);
  };

// io.on("connection", function(socket) {
//     socket.on("send message", function(sent_msg, callback) {
//         sent_msg = "[ " + getCurrentDate() + " ]: " + sent_msg;
//         io.sockets.emit("update messages", sent_msg);
//         callback();
//     });
// });

// function response(req, res){
//     var file = "";
//     if (req.url == "/") {
//         file = __dirname + '/index.html'
//     }else{
//         file = __dirname + req.url;
//     }
//     console.log(file);

//     fs.readFile(file, function (err,data) {
//         if (err) {

//             res.writeHead(404);
//             return res.end("Page not found");
//         }
        
//         res.writeHead(200);
//         res.end(data);
//     });
// }

// function getCurrentDate() {
//     var currentDate = new Date();
//     var day = (currentDate.getDate() < 10 ? '0' : '') + currentDate.getDate();
//     var month = ((currentDate.getMonth() + 1) < 10 ? '0' : '') + (currentDate.getMonth() + 1);
//     var year = currentDate.getFullYear();
//     var hour = (currentDate.getHours() < 10 ? '0' : '') + currentDate.getHours();
//     var minute = (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes();
//     var second = (currentDate.getSeconds() < 10 ? '0' : '') + currentDate.getSeconds();
//     return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
// }