
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString } from '../../../static/decorators';

@name('Clever Ruse')
@cost(0)
@cooldown(2)
@classes({ Thief: 1 })
@targets(ActionTargets.SINGLE_ALLY)
@description('Craft a clever ruse, raising dexterity for one of your allies.')
@useString('%o created a %n for %t!')
@effect('DEX+', { roll: '3d1', string: 'round' })
export default class CleverRuse extends Action {

}