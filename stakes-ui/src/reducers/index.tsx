import { AppAction } from '../actions';
import { StoreState } from '../types/index';
import { START_LOADING, END_LOADING, INVESTORS_LOADED } from '../constants/index';

export function reducers(state: StoreState, action: AppAction): StoreState {
  switch (action.type) {
    case START_LOADING:
      return Object.assign({}, {...state}, {loading: true});
    case END_LOADING:
      return Object.assign({}, {...state}, {loading: false});
    case INVESTORS_LOADED:
    return Object.assign({}, {...state}, {investors: action.data});
  }
  return state;
}
