import express from 'express';
import bodyParser from 'body-parser';

import { PORT } from './env';
import { preParse, parse } from './parser';

const app = express();

app.set('port', PORT);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', preParse, parse);

export default app;
