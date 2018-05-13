import { ICollection } from './Types';

export class DataObject {

  public id: number|undefined;
  public className: string;
  public apiName: string;

  constructor(className: string, apiName: string, id?: number) {
    this.id = id;
    this.className = className;
    this.apiName = apiName;
  }

  public collections() : ICollection[] {
    return []
  }
}
