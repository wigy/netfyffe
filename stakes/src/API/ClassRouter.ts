import Knex = require('knex');
import { Request, Response, Router, RequestHandler } from 'express';
import { DataObject } from '../Common/DataObject';
import { Inherits } from '../Common/Types/Inherits';

export namespace ClassRouter {

  export function forClass(targetClass: Inherits<DataObject>) : Router {

    const config = require('../../knexfile.js');
    const router: Router = Router();
    const target = new targetClass({});

    // Get all entries.
    router.get('/', (req: Request, res: Response) => {
      Knex(config)
        .select('*')
        .from(target.apiName)
        .then((data) => {
          res.send(data);
        })
    });

    // Get single entry and fill in collections.
    router.get('/:id', (req: Request, res: Response) => {
      const id = req.params.id;
      Knex(config)
        .select('*')
        .from(target.apiName)
        .where({id: id})
        .then((data) => {
          if (data.length) {
            let ret = data[0];
            Promise.all(target.collections().map((collection) => {
              let where: any = {};
              where[collection.linkField] = ret.id;
              return Knex(config)
                .select('*')
                .from(collection.tableName)
                .where(where)
                .then((sub) => {
                  ret[collection.name] = sub;
                });
            }))
              .then(() => {
                res.send(ret);
              });
          }
        })
    });

    return router;
  }
}
