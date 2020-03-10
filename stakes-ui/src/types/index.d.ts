export interface Fund {
  id?: number;
  name?: string;
  tag?: string;
}

export interface Investor {
  id?: number;
  name?: string;
  tag?: string;
  email?: string;
}

export interface ValueChange {
  amount: number;
}

export interface Transfer {
  from?: ValueChange;
  to?: ValueChange;
}

export interface TilitintinContextType {
  tags: {[key: string]: string};
}
