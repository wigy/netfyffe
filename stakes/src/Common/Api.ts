import { DataObject } from './DataObject';
import { IData } from './Types';
import { Inherits } from './Types';

export function getAll<T extends Inherits<DataObject>>(TargetClass: T) : Promise<T[]> {
  const sample = new TargetClass({id: 99});
  // TODO: Make configurable.
  return fetch('http://localhost:9003/' + sample.apiName)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => data.map((d: IData) => new TargetClass(d)))
    .catch((err) => {
      console.error('API ERROR:', err);
    });
}
