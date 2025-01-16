import express from 'express';
import bodyParser from 'body-parser';

export const app = express();

app.use('/graphql', bodyParser.json());
