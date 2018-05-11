import { ICollection } from './Types/Collection';

export class DataObject {

  public id: number;
  public className: string;

  constructor(id: number, className: string) {
    this.id = id;
    this.className = className;
  }

  public collections() : ICollection[] {
    return []
  }
}
