import Knex = require('knex');
import { Request, Response, Router, RequestHandler } from 'express';
import { DataObject } from '../Common/DataObject';
import { Inherits } from '../Common/Types/Inherits';

export class ClassRouter {

  static forClass(tableName: string, targetClass: Inherits<DataObject>) : Router {

    const config = require('../../knexfile.js');
    const router: Router = Router();

    router.get('/', (req: Request, res: Response) => {
      Knex(config)
        .select('*')
        .from(tableName)
        .then((data) => {
          res.send(data);
        })
    });

    return router;
  }
}
