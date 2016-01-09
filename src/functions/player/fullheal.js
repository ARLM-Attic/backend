
export default (player) => {
    var profession = require(`../../player/professions/${player.profession}`).default;
    player.stats.hp.cur = profession.hp(player);
    player.stats.mp.cur = profession.mp(player);
    return player;
};