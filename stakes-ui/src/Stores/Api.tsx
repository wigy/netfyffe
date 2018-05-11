import { DataObject } from '../Common/DataObject';
import { Inherits } from '../Common/Types/Inherits';

class Api  {

  public static getAll(TargetClass: Inherits<DataObject>) : Promise<any> {
    const sample = new TargetClass({});
    // TODO: Make configurable.
    return fetch('http://localhost:9003/' + sample.apiName)
      .then((response) => {
        return response.json();
      })
      .then((data) => data.map((d: any) => new TargetClass(d)))
      .catch((err) => {
        console.error('API ERROR:', err);
      });
  }
}

export default Api;
