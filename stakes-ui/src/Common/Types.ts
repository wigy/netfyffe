export interface ICollection {
  name: string,
  linkField: string,
  tableName: string
};

export interface IData {
  id: number|undefined,
  [other: string]: any
}

export interface Inherits<T> { new (...args: any[]): T; };
