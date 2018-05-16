import { AppAction } from '../actions';
import { StoreState } from '../types/index';
import { START_LOADING, END_LOADING, DATA_LOADED } from '../constants/index';

export function reducers(state: StoreState, action: AppAction): StoreState {
  switch (action.type) {
    case START_LOADING:
      return Object.assign({}, {...state}, {loading: true});
    case END_LOADING:
      return Object.assign({}, {...state}, {loading: false});
    case DATA_LOADED:
      const update = {};
      update[action.target] = action.data;
      return Object.assign({}, {...state}, update);
  }
  return state;
}
