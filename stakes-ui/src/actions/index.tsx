import * as constants from '../constants'
import { Investor } from '../Common/Investor'

export interface StartLoading {
  type: constants.START_LOADING;
}

export interface EndLoading {
  type: constants.END_LOADING;
}

export interface InvestorsLoaded {
  data: Investor[];
  type: constants.INVESTORS_LOADED;
}

export type AppAction = StartLoading | EndLoading | InvestorsLoaded;

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
export function investorsLoaded(data: any[]): InvestorsLoaded {
  return {
    data,
    type: constants.INVESTORS_LOADED,
  }
}
