const name = 'scheduler';

export = function(RED) {
    var global = RED.settings.functionGlobalContext;
    // var logger = global.logger.getLogger('node-scheduler');

    function Node(config) {
        RED.nodes.createNode(this, config);

        var node = this;
        node.hour = parseInt(config.hour);
        node.minute = parseInt(config.minute);

        var current = new Date();
        var hour = current.getHours();
        var min = current.getMinutes();

        node.log('Setting scheduler for ' + node.hour + ':' + node.minute + ' from ' + hour + ':' + min);

        var mins = ((24 + node.hour - hour)*60) + (node.minute - min);
        if (mins > 1440) mins = mins - 1440;
        node.log('Scheduler mins ' + mins);

        var wait = mins * 60000;
        node.log('Setting scheduler for ' + node.hour + ':' + node.minute + ' in ' + wait + 'ms');

        // should try and be more intelligent than this :-/
        var timer = setTimeout(tick, wait);

        node.on("close", function() {
            clearTimeout(timer);
        });

        function tick() {
            const msg = { payload: {}, topic:name };
            node.send(msg);
            node.log('Scheduler');
        }
    }
    RED.nodes.registerType(name,Node);
};
