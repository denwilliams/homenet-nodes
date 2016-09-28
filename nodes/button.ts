import { IEventBus } from 'homenet-core';

export = function(RED) {
  const global = RED.settings.functionGlobalContext;
  const eventBus: IEventBus = global.services.get('IEventBus');

  function NodeIn(config) {
    const node = this;
    RED.nodes.createNode(node, config);
    const evt = `button.${config.button}.${config.action}`;

    eventBus.on(evt, null, handleEvent);

    node.on('close', () => {
      (<any> eventBus).removeListener(evt, null, handleEvent);
    });

    function handleEvent(e) {
      node.send({
        topic: `button/${config.button}/${config.action}`,
        payload: e.data
      });
    }
  }

  RED.nodes.registerType("button in", NodeIn);
};
