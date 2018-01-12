const path = require('path');
const Express = require('express');

const fs = require('fs');

const password = 'christmas';

let app = Express();
// let router = Express.Router();
let server, ENV;

ENV = app.settings.env;

let activeProject;
let directory;

if (ENV === 'development') {
    activeProject = process.env.npm_lifecycle_event;

    directory = activeProject.split('start_')[1];
}

const PATH_STYLES = path.resolve(__dirname, 'htdocs/');
const PATH_DIST = path.resolve(__dirname, 'htdocs/');

app.use('/styles', Express.static(PATH_STYLES));
app.use(Express.static(PATH_DIST));

app.get('/', (req, res) => {

    if (ENV === 'production') {
        directory = req.headers.host.split('.')[0];
    }

    if (directory === 'www') {
        directory = 'portfolio';
    }

    res.sendFile(path.resolve(__dirname, 'htdocs/'+directory+'/src/client/index.html'));

    if (req.url.indexOf('static-pages') === 1) {
        res.sendFile(path.resolve(__dirname, 'htdocs/'+directory+'/dist/static-pages/html/index.html'));
    }
});


server = app.listen(process.env.PORT || 3000, () => {
    const port = server.address().port;

    console.log('Server is listening at %s', port);
});

const io = require('socket.io').listen(server);

io.on('connection', (client) => {
    // here you can start emitting events to the client
    console.log('Client connected...');

    client.on('get_data', function (fileName) {
        fs.readFile(path.resolve(__dirname, './htdocs/'+directory+'/dist/'+ fileName +'.json'), 'utf8', function readFileCallback(err, data){
            if (err) {
                return console.log(err);
            }

            client.emit('send_data', JSON.parse(data));
        })
    });

    client.on('save_data', function (data, fileName) {
        fs.writeFile(path.resolve(__dirname, './htdocs/'+directory+'/dist/'+fileName+'.json'), JSON.stringify(data), function(err) {
            if (err) {
                return console.log(err);
            }

            fs.readFile(path.resolve(__dirname, './htdocs/'+directory+'/dist/'+fileName+'.json'), 'utf8', function readFileCallback(err, data){
                if (err) {
                    return console.log(err);
                }

                console.log(data);
                client.broadcast.emit('send_data', JSON.parse(data));
            });

            console.log('New items saved in the list !');
        })
    })

    client.on('password_asking', function(data){

        if (data === password) {
            client.emit('ok_to_edit');
        }
    })
});
