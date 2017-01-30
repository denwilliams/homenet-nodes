import { ISwitchManager } from '@homenet/core';

export = function(RED) {
  const global = RED.settings.functionGlobalContext;
  const switches: ISwitchManager = global.switches;

  function Node(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    let timer = null;
    const lightId = config.lightId;
    const defaultState = config.state;
    const duration = config.duration || 0;
    // const opts = (config.duration) ? {duration:config.duration} : undefined;

    node.on('input', msg => {
      const state = defaultState || msg.payload;
      if (timer) clearTimeout(timer);
      switches.set(`light.${lightId}`, state);
      timer = setTimeout(() => {
        node.send(msg);
      }, duration);
    });

    node.on('close', function() {
      if (timer) clearTimeout(timer);
    });

  }

  RED.nodes.registerType('lights', Node);
};
