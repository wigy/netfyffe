import { Store } from 'redux';

import { DataObject } from '../Common/DataObject';
import { Inherits } from '../Common/Types';
import { getAll } from '../Common/Api';
import { startLoading, endLoading, investorsLoaded } from '../actions/index';

export class StoreManager {

  public store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  public loadAll<T extends Inherits<DataObject>>(TargetClass: T): void {
    this.store.dispatch(startLoading());

    getAll(TargetClass)
      .then((data) => {
        this.store.dispatch(endLoading());
        this.store.dispatch(investorsLoaded(data));
      })
      .catch((err) => {
        this.store.dispatch(endLoading());
        console.error(err);
      });
  }
}
