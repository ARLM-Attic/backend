
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, unstackable, targeting, family } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Attack')
@cost(0)
@cooldown(0)
@classes({ All: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Attack your foe with your weapon.')
@useString('%o attacked %t and dealt %d damage!')
@effect('Damage', { roll: '1df([str] / 2) + f([str] / 6)' })
@unstackable
@targeting(damage)
@family([ActionTypes.PHYSICAL])
export default class Attack extends Action {

}