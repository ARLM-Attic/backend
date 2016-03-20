
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, unblockable } from '../../../static/decorators/spell';

@name('Cold Snap')
@cost(32)
@cooldown(0)
@classes({ Mage: 16 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Chill your foe with an icy touch, dealing moderate damage and carrying a decent chance to freeze.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Damage', { roll: '2df([mnt] / 2) + 1' })
@effect('Freeze', { chance: 35, roll: '1d1', string: 'round' })
@unblockable
export default class ColdSnap extends Action {

}