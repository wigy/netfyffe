import { Collection } from './Types/Collection';

export class DataObject {

  id: number;
  className: string;

  constructor(id: number, className: string) {
    this.id = id;
    this.className = className;
  }

  collections() : Collection[] {
    return []
  }
}
