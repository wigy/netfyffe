import { DataObject } from '../Common/DataObject';
import { IData } from '../Common/Types/IData';
import { Inherits } from '../Common/Types/Inherits';

export function getAll<T extends Inherits<DataObject>>(TargetClass: T) : Promise<T[]> {
  const sample = new TargetClass({id: 99});
  // TODO: Make configurable.
  return fetch('http://localhost:9003/' + sample.apiName)
    .then((response) => {
      return response.json();
    })
    .then((data) => data.map((d: IData) => new TargetClass(d)))
    .catch((err) => {
      console.error('API ERROR:', err);
    });
}
