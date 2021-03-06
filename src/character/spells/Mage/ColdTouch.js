
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, unblockable, targeting, family } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Cold Touch')
@cost(9)
@cooldown(0)
@classes({ Mage: 6 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Chill your foe with an icy touch, dealing low damage but carrying a chance to freeze.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Damage', { roll: '1df([mnt] / 2) + f([mnt] / 6)' })
@effect('Freeze', { chance: 25, roll: '1d1', string: 'round' })
@unblockable
@targeting(damage)
@family([ActionTypes.ICE, ActionTypes.MAGICAL])
export default class ColdTouch extends Action {

}