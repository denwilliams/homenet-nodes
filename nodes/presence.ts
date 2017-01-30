import { INodeREDContext, IPresenceManager } from '@homenet/core';

export = function(RED) {
    const global: INodeREDContext = RED.settings.functionGlobalContext;
    const presence: IPresenceManager = global.services.get<IPresenceManager>('IPresenceManager');

    function NodeIn(config) {
        var self = this;

        RED.nodes.createNode(this,config);

        var id = config.pid;

        var node = this;

        presence.on(id, handlePresence);

        this.on('close', function() {
            presence.removeListener(id, handlePresence);
        });

        function handlePresence(data) {
            var msg = {
                topic: 'presence/'+id,
                payload: data
            };
            console.log('PRESENCE', data);
            if (data) {
                node.send([msg,null]);
            } else {
                node.send([null,msg]);
            }
        }
    }

    function NodeOut(config) {
        var self = this;

        RED.nodes.createNode(this,config);

        var id = config.pid;

        var node = this;

        this.on("input", function(msg) {
            var p = presence.get(id);
            if (p) {
                if (msg.payload === 'true') p.set();
                else p.clear();
            }
        });
    }

    RED.nodes.registerType("presence out",NodeOut);
    RED.nodes.registerType("presence in",NodeIn);
};
