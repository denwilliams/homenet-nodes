import { IEventBus } from '@homenet/core';

export = function(RED) {
  const global = RED.settings.functionGlobalContext;
  const eventBus: IEventBus = global.services.get('IEventBus');

  function MacroNode(config) {
    const node = this;
    RED.nodes.createNode(node, config);
    const evt = `macro.${config.macro}.execute`;

    eventBus.on(evt, null, handleEvent);

    node.on('close', () => {
      (<any> eventBus).removeListener(evt, null, handleEvent);
    });

    function handleEvent(e) {
      node.send({
        topic: `macro/${config.macro}/execute`,
        payload: e.data
      });
    }
  }

  RED.nodes.registerType("macro", MacroNode);
};
