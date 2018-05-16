import * as constants from '../constants'
import { Investor } from '../Common/Investor'

export interface StartLoading {
  type: constants.START_LOADING;
}

export interface EndLoading {
  type: constants.END_LOADING;
}

export interface DataLoaded {
  target: string,
  data: Investor[];
  type: constants.DATA_LOADED;
}

export type AppAction = StartLoading | EndLoading | DataLoaded;

export function startLoading(): StartLoading {
  return {
    type: constants.START_LOADING
  }
}

export function endLoading(): EndLoading {
  return {
    type: constants.END_LOADING
  }
}

// TODO: Hmm, Investor[] not working here.
export function dataLoaded(target: string, data: any[]): DataLoaded {
  return {
    target,
    data,
    type: constants.DATA_LOADED,
  }
}
