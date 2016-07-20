import { IPersistence } from 'homenet-core';

export = function(RED) {
  function GetValue(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const global = RED.settings.functionGlobalContext;
    const persistence: IPersistence = global.services.get('IPersistence');
    const key = config.key;

    node.on('input', msg => {
      persistence.get(key).then(value => {
        msg.payload = value;
        node.send(msg);
      });
    });
  }

  function SetValue(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const global = RED.settings.functionGlobalContext;
    const persistence: IPersistence = global.services.get('IPersistence');
    const key = config.key;
    const value = config.val;

    node.on('input', msg => {
      msg.payload = value || msg.payload;
      persistence.set(key, msg.payload)
      .then(() => node.send(msg));
    });
  }

  RED.nodes.registerType("get value", GetValue);
  RED.nodes.registerType("set value", SetValue);
};
