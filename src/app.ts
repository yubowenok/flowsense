import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { PORT } from './env';
import { preParse, parse } from './parser';
import { autoComplete } from './auto-complete';

const app = express();

app.set('port', PORT);
app.use(cors({
  origin: (origin: string, callback: (err: Error, allow?: boolean) => void) => {
    callback(null, true);
  },
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/query', preParse, parse);
app.post('/auto-complete', preParse, autoComplete);

export default app;
