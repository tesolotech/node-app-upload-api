const express = require('express');

const File = require('./app/models/file.model.js');

const bodyParser = require('body-parser');

var multer = require('multer');

var storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

var upload = multer({ storage: storage })

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use(express.static('uploads'))

const mongoose = require('mongoose');

// Configuring the database
const dbConfig = require('./dbconfig/database.config.js');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    promiseLibrary: global.Promise,
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// Handling CORS error     
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-with, Content-Type, Accept, Authorization');
    if (res.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, GET, DELETE, POST, PATCH');
        return res.status(200).json({});
    }
    next();
});


app.set('port', process.env.PORT || 3000);

app.post('/uploadFiles', upload.array('profile', { maxCount: 12 }), function (req, res, next) {
    console.log(req.files)
    var count = 0;
    if (req.files.length > 0) {

        for (let i = 0; i < req.files.length; i++) {
            const files = new File({
                _id: new mongoose.Types.ObjectId(),
                filePath: req.files[i].filename
            })
            files.save();
            count++;
        }
    }
    res.status(200).json({
        message: `${count} Files uploaded successfully`
    })

});

app.get('/getFiles', function (req, res, next) {
    File.find()
        .then(files => {
            res.send(files);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
})

app.listen(app.get('port'), () => console.log(`Server is listening on port ${app.get('port')}`));

