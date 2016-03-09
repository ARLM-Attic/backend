
import _ from 'lodash';
import seedrandom from 'seedrandom';

import SETTINGS from '../static/settings';

import Weapon from '../items/Weapon';
import Armor from '../items/Armor';

import dbPromise from './db';
import { weightedChoice } from '../functions/helpers';

const QUALITY = [
    { tier: -1, name: 'Trash',        weight: -1000, minLevel: 0 },
    { tier: 0,  name: 'Basic',        weight: 20,    minLevel: 0 },
    { tier: 1,  name: 'Common',       weight: 7,     minLevel: 0 },
    { tier: 2,  name: 'Uncommon',     weight: 5,     minLevel: 10 },
    { tier: 3,  name: 'Rare',         weight: 3,     minLevel: 25 },
    { tier: 4,  name: 'Epic',         weight: 1,     minLevel: 40 },
    { tier: 10, name: 'Legendary',    weight: -100,  minLevel: 50 }
];

const determineBaseQuality = (playerLevel, luckBonus = 0, seed = Date.now()) => {
    const adjustedQualities = _.cloneDeep(QUALITY);
    _.each(adjustedQualities, q => q.weight += luckBonus);

    return weightedChoice(_.reject(adjustedQualities, q => q.minLevel > playerLevel), seed);
};

const getProto = (type) => {
    switch(type) {
        case 'armor': return Armor;
        case 'weapon': return Weapon;
    }
};

export default class ItemGenerator {

    static async loadType(type) {
        const db = await dbPromise();
        const collection = db.collection(`item.${type}Data`);
        return new Promise((resolve, reject) => {

            // find the lowest item id
            collection.findOne({}, { sort: { _id: 1 }, limit: 1 }, (err, minRes) => {
                if(err) return reject(err);
                const min = minRes._id;

                // find the highest item id
                collection.findOne({}, { sort: { _id: -1 }, limit: 1 }, (err, maxRes) => {
                    if(err) return reject(err);
                    const max = maxRes._id;

                    resolve({ type, min, max, diff: max - min });
                });
            });
        });
    }

    static init() {
        const typesToLoad = ['armor', 'weapon', 'attribute', 'prefix', 'suffix'];
        this.typeData = _.map(typesToLoad, this.loadType);
    }

    static mergeItemStats(myStats, newStats) {
        _.each(_.keys(newStats), stat => {
            if(!myStats[stat]) myStats[stat] = 0;
            myStats[stat] += newStats[stat];
        });
        return myStats;
    }

    static rollCheck(dice, luckBonus, rng) {
        return Math.floor(rng() * dice) <= 1 + luckBonus;
    }

    static async generate(playerReference, type, seed) {

        const luckBonus = playerReference.stats.luk;
        const baseItemQuality = determineBaseQuality(playerReference.currentLevel, luckBonus, seed);

        const rng = seedrandom(seed);
        if(!type) type = ['armor', 'weapon'][Math.round(rng())];

        const item = await this.getRandom(type, { baseQuality: { $lte: baseItemQuality.tier } }, rng);

        const extraValidity = { minLevel: { $lte: playerReference.currentLevel } };

        let attributeMaxDice = 20;
        let currentQuality = 0;
        let currentLevelRequirement = baseItemQuality.minLevel;

        const chosenAttrs = [];

        const canChooseMoreAttrs = () => {

                    // uncommon items get 1 guaranteed prefix
            return (chosenAttrs.length < 1 && baseItemQuality.tier > 1) ||

                    // epic items get 2 guaranteed prefixes
                   (chosenAttrs.length < 2 && baseItemQuality.tier > 3) ||

                    // legendary items get 3 guaranteed prefixes
                   (chosenAttrs.length < 3 && baseItemQuality.tier > 9);
        };

        while(canChooseMoreAttrs() || this.rollCheck(attributeMaxDice, luckBonus, rng)) {

            // 10 times harder to roll subsequent attributes
            attributeMaxDice *= 10;

            // no getting the same attribute twice
            const validityCheck = _.cloneDeep(extraValidity);
            validityCheck.name = { $nin: chosenAttrs };

            const attribute = await this.getRandom('attribute', validityCheck, rng);
            item.stats = this.mergeItemStats(item.stats, attribute.stats);
            item.name = `${attribute.name} ${item.name}`;
            chosenAttrs.push(attribute.name);
            currentQuality += 1;
            currentLevelRequirement += attribute.levelMod || 0;
        }

        if(baseItemQuality.tier > 2 || this.rollCheck(100, luckBonus, rng)) {
            const prefix = await this.getRandom('prefix', extraValidity, rng);
            item.stats = this.mergeItemStats(item.stats, prefix.stats);
            item.name = `${prefix.name} ${item.name}`;
            currentQuality += 1;
            currentLevelRequirement += prefix.levelMod || 0;
        }

        if(baseItemQuality.tier > 3 || this.rollCheck(100, luckBonus, rng)) {
            const suffix = await this.getRandom('suffix', extraValidity, rng);
            item.stats = this.mergeItemStats(item.stats, suffix.stats);
            item.name = `${item.name} ${suffix.name}`;
            currentQuality += 1;
            currentLevelRequirement += suffix.levelMod || 0;
        }

        // set the quality to whatever was generated
        item.quality = currentQuality;
        item.levelRequirement = Math.min(SETTINGS.MAX_LEVEL, currentLevelRequirement);
        item.seed = seed;
        const constructedItem = new (getProto(type))(item);
        constructedItem.dropRate = item.dropRate;

        return constructedItem;
    }

    static async getRandom(type, extraFilter = {}, rng = Math.random) {
        const db = await dbPromise();
        const itemData = db.collection(`item.${type}Data`);

        const typeData = await Promise.all(this.typeData);
        const { diff } = _.find(typeData, { type });

        const _id = Math.floor(rng() * diff);

        return new Promise((resolve, reject) => {
            const filter = _.extend({ _id: { $gte: _id } }, extraFilter);
            itemData.findOne(
                filter,
                { sort: { _id: 1 }, limit: 1 },
                (err, item) => {
                    if(err) return reject(err);
                    resolve(item);
                });
        });
    }
}