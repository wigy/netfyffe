import { Request, Response, Application, Router } from 'express';
import { ClassRouter } from './API/ClassRouter';
import { Investor } from './Common/Investor';
import { Account } from './Common/Account';

const app: Application = require('express')();

app.use('/investors', ClassRouter.forClass('investors', Investor));
app.use('/accounts', ClassRouter.forClass('accounts', Account));

export default app;
