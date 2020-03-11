export interface Fund {
  id?: number;
  name?: string;
  tag?: string;
  accounts?: Account[];
}

export interface Service {
  id?: number;
  name?: string;
  tag?: string;
}

export interface Investor {
  id?: number;
  name?: string;
  tag?: string;
  email?: string;
  color?: string;
  shares?: Share[];
}

export interface Share {
  id?: number;
  date?: string;
  amount?: number;
  transfer?: Transfer;
  investor?: Investor;
  fund?: Fund;
}

export interface ValueChange {
  id?: number;
  date?: string;
  amount?: number;
  comment?: Comment;
  account?: Account;
}

export interface Transfer {
  from?: ValueChange;
  to?: ValueChange;
}

export interface Account {
  id?: number;
  number?: string;
  name?: string;
  fund?: Fund;
  service?: Service;
}

export interface CommentData {
  type?: string;
  subtype?: string;
  investor?: {
    id?: number;
    name?: string;
    email?: string;
  };
  description?: string;
  fund?: string;
}

export interface Comment {
  id?: number;
  data?: CommentData;
  transfer?: Transfer;
}

export interface TilitintinContextType {
  tags: {[key: string]: string};
}

export interface InvestorMap {
  [key: number]: Investor;
}

export interface ShareMap {
  [key: number]: Share;
}

export interface ShareAmountMap {
  [key: number]: number;
}

// Index names for colors in styles.tsx.
type ColorName = 'orange' | 'purple' | 'green' | 'lightGreen' | 'red' | 'pink' | 'yellow' | 'indigo';
