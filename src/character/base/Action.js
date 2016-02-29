
import _ from 'lodash';
import Logger from '../../objects/logger';

export default class Action {

    constructor() {
        if(_.isUndefined(this.spellName))       Logger.error('No spell name set.', this);
        if(_.isUndefined(this.spellCost))       Logger.error('No spell cost set.', this);
        if(_.isUndefined(this.spellCooldown))   Logger.error('No spell cooldown set.', this);
        if(_.isUndefined(this.spellClasses))    Logger.error('No spell classes set.', this);
        if(_.isUndefined(this.spellDescription))Logger.error('No spell desc set.', this);
        if(_.isUndefined(this.spellUseString))  Logger.error('No spell use string set.', this);
    }

}

export const ActionTargets = {
    SELF: 'Self',
    SINGLE_ENEMY: 'Single Enemy',
    SINGLE_ALLY: 'Single Ally',
    ALL_ENEMY: 'All Enemies',
    ALL_ALLY: 'All Allies',
    ALL: 'All'
};