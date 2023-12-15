const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

// initialize DB file and variable
const initDb = require('./helpers/db').initDb;

// read and initialize all routes
const StudentRoutes = require('./routes/student.routes');
const ClassRoutes = require('./routes/class.routes');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

// initialize app routes to use /api/v1/{Student,Class}
app.use('/api/v1', StudentRoutes);
app.use('/api/v1', ClassRoutes);

app.use((error, req, res, next) => {
	const errorMessage = error.message ? error.message : 'something went wrong';
	const errorStatusCode = error.statusCode;

	res.status(errorStatusCode).json({ error: errorMessage });
});

// call initialize and connect to DB
initDb((error, client) => {
	if (error) {
		console.error('MongoDB Atlas connection failed');
        console.error(error);
	} else {
		console.log('MongoDB Atlas connection successful');
		// db connection success so start listening on port
		app.listen(port,() => {
            console.log(`server is listening on port ${port}`);
        });
	}
});