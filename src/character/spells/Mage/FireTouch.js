
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description } from '../../../static/decorators';

@name('Fire Touch')
@cost(5)
@cooldown(0)
@classes({ Mage: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Scorch your foe with a small flame, dealing low damage but carrying a chance to burn.')
export default class FireTouch extends Action {

}