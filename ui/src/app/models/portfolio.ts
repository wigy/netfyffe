import { AccountGroup } from './account_group';

export class Portfolio {

    groups: AccountGroup[];

    constructor(data?: AccountGroup[]) {
        this.groups = data ? data : [];
    }
}
