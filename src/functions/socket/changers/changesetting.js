
import _ from 'lodash';

import getPlayer from '../../../character/functions/getbyname';
import MESSAGES from '../../../static/messages';

import updatePlayer from '../../updaters/player';

export default (socket) => {

    const settingsChange = async ({ name, settingHash }, respond) => {

        if(!socket.getAuthToken()) {
            return respond({msg: MESSAGES.INVALID_TOKEN});
        }

        if(!name) {
            return respond({msg: MESSAGES.NO_NAME});
        }

        if(_.isEmpty(settingHash)) {
            return respond({msg: MESSAGES.NO_SETTINGS});
        }

        let player = null;

        try {
            player = await getPlayer(name);
        } catch(e) {
            return respond({msg: e.msg});
        }

        if(player.battleId) {
            return respond({msg: MESSAGES.CURRENTLY_IN_COMBAT});
        }

        _.extend(player.settings, settingHash);
        player.save();

        socket.emit('update:settings', player.settings);

        respond(null, {msg: MESSAGES.SETTING_SUCCESS});

    };

    socket.on('player:change:setting', settingsChange);
};