// const express = require('express');
// const cors = require('cors');
// const path = require("path");
// const mysql = require('mysql');
// require('dotenv').config();
// const bodyParser = require('body-parser');

// // const port = process.env.DB_POST || 3309;
// const port = process.env.SERVER_PORT || 3307;

// const server = express();

// // Sử dụng body-parser
// // server.use(bodyParser.json());
// // server.use(bodyParser.urlencoded({ extended: true }));
// server.use(bodyParser.json({ limit: '50mb' }));
// server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
// server.use(cors());


// // TODO - Cấu hình Router API
// server.use("/api", require("./src/routes/apis.route"));

// server.use("/menu", express.static(path.join(__dirname, "public/menu")));
// server.use("/public", express.static(path.join(__dirname, "public")));
// server.use(express.static(path.join(__dirname, "src")));




// // Kết nối tới cơ sở dữ liệu MySQL
// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     port: process.env.DB_POST || 3306
// });

// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to database:', err);
//         process.exit(1);
//     }
//     console.log('Connected to MySQL database');
// });

// server.on('close', () => {
//     connection.end();
//     console.log('Connection to database closed');
// });

// module.exports = connection;



// server.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });




const express = require('express');
const cors = require('cors');
const path = require("path");
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();
const port = process.env.SERVER_PORT || 3307;

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// Static files
app.use("/menu", express.static(path.join(__dirname, "public/menu")));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "src")));

// Routes
app.use("/api", require("./src/routes/apis.route"));

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});