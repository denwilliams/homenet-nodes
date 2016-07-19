import { ISwitchManager } from 'homenet-core';

export = function(RED) {
  var global = RED.settings.functionGlobalContext;
  var switches: ISwitchManager = global.switches;

  function Node(config) {
    RED.nodes.createNode(this, config);

    var lightId = config.lightId;
    var defaultState = config.state;

    //var opts = (config.duration) ? {duration:config.duration} : undefined;

    this.on('input', function(msg) {
      var state = defaultState || msg.payload;

      switches.set('light', lightId, state);
    });
  }

  RED.nodes.registerType('lights', Node);
};
