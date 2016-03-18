
import ProfessionManager from '../objects/professionmanager';

export default {
    RADIUS: 5000,
    INVENTORY_SIZE: 50,
    HOMEPOINT_CHANGE_HOURS: 4,
    MAX_PARTY_MEMBERS: 5,
    MAX_PARTY_JOIN_DISTANCE: 200,
    MAX_LEVEL: 50,

    CLASS_DESCRIPTIONS: ProfessionManager.getProfessionDescriptions(),

    MONSTER_GENERATION: {
        PLAYER: {
            offsets: {
                lat: 0.025,
                lon: 0.025
            },
            amounts: {
                min: 500,
                max: 650
            }
        },
        DUNGEON: {
            levelOffset: {
                min: 2,
                max: 5
            },
            offsets: {
                lat: 0.0005,
                lon: 0.0005
            },
            amounts: {
                min: 5,
                max: 10
            }
        }
    }
};