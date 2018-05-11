import { Investor } from '../Common/Investor';

class Api  {

  public static getAll() : Promise<any> {
    // TODO: Make configurable.
    return fetch('http://localhost:9003/investors')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data.map((d: any) => new Investor(d)));
      })
      .catch((err) => {
        console.error('API ERROR:', err);
      });
  }
}

export default Api;
