import { Investor } from '../Common/Investor';

export interface StoreState {
  loading: boolean,
  investors: Investor[],
  investor?: Investor
}

export function create(): StoreState {
  return {
    investors: [],
    investor: undefined,
    loading: false
  };
}
