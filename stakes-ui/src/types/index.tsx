import { Investor } from '../Common/Investor';

export interface StoreState {
  loading: boolean,
  investors: Investor[]
}

export function create(): StoreState {
  return {
    investors: [],
    loading: false
  };
}
