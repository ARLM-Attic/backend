
import _ from 'lodash';

import Logger from '../objects/logger';

const spellEffectHierarchy = require('require-dir')('../combat/spelleffects', { recurse: true });

const allSpellEffectsHash = _(spellEffectHierarchy)
    .values()
    .reduce((prev, cur) => {
        _.extend(prev, cur);
        return prev;
    }, {});

export default class SpellEffectManager {
    static getEffectByName(name) {
        if(!allSpellEffectsHash[name]) {
            Logger.error('Spell:Init', new Error(`${name} is not a valid spell effect.`));
            return;
        }
        return allSpellEffectsHash[name].default;
    }
}