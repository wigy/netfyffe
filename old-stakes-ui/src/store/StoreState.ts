import { Investor } from '../Common/Investor';

export interface StoreState {
  loading: boolean,
  investors: Investor[],
  investor?: Investor
}
