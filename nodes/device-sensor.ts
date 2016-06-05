// Looks like this is out of date and no longer has a purpose

export = function(RED) {
    var global = RED.settings.functionGlobalContext;
    var ninja = global.ninja;

    function Node(config) {
        var self = this;

        RED.nodes.createNode(this,config);

        var device = config.device;
        const id = config.id;
        var node = this;

        ninja.on(id, handleSensor);

        this.on('close', function() {
            //ninja.removeListener(id, handlePresence);
        });

        function handleSensor(data) {
            var msg = {
                topic: 'sensor/'+id,
                payload: data
            };
            node.send(msg);
        }
    }

    RED.nodes.registerType("devicesensor",Node);

};
