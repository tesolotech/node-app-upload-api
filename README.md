# node-app-upload-api
Node app with express serrver with upload file end point

To Run this app you need to connect mongodb database and add dbconfig/database.config.js which containts configuration info like:

module.exports = {
    
    url: 'Mongodb connection string'
}

After creating this couple of file or directory you install dependency by executing npm i and after its hit npm start which will start server

Endpoints:
http://localhost:3000/getFiles --get

http://localhost:3000/uploadFiles --post
