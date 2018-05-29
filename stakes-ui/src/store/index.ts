import { StoreState } from './StoreState';

export function create(): StoreState {
  return {
    investors: [],
    investor: undefined,
    loading: false
  };
}
