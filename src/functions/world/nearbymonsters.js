
import places from 'googleplaces';
import seedrandom from 'seedrandom';
import q from 'q';
import _ from 'lodash';

import MESSAGES from '../../static/messages';
import SETTINGS from '../../static/settings';

import monstergenerate from '../../objects/monstergenerator';

// the offsets and directions to generate the bounds at which monsters spawn
const OFFSETS = {
    latDown: -0.025,
    latUp: 0.025,
    lonDown: -0.025,
    lonUp: 0.025
};

const randomBetween = (rng = Math.random, min, max) => rng() * (max - min) + min;

export default (homepoint) => {
    const { lat, lon } = homepoint;

    // seed monsters based on the hour
    const now = new Date();
    now.setMilliseconds(0);
    now.setSeconds(0);
    now.setMinutes(0);

    const seed = now.getTime();

    const rng = seedrandom(seed);
    const numMonsters = randomBetween(rng, 250, 500);

    const monsters = [];

    for(let i = 0; i < numMonsters; i++) {
        const monLat = randomBetween(rng, lat+OFFSETS.latDown, lat+OFFSETS.latUp);
        const monLon = randomBetween(rng, lon+OFFSETS.lonDown, lon+OFFSETS.lonUp);

        monsters.push(monstergenerate({
            location: {
                lat: monLat,
                lon: monLon
            }
        }))
    }

    return monsters;

};