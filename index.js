const express = require('express');
const filmRouter = require('./routes/film.router');


const PORT = 8888;

const app = express();

app.use(express.json());
app.use('/film', filmRouter);

app.listen(PORT, () => console.log(`film server started on port ${PORT}`));
