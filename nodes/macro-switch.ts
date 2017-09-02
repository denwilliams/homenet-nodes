import { IEventBus, ICommandManager } from '@homenet/core';

export = function(RED) {
  const global = RED.settings.functionGlobalContext;
  const eventBus: IEventBus = global.services.get('IEventBus');
  const commands: ICommandManager = global.services.get('ICommandManager');

  function MacroSwitchNode(config) {
    const node = this;
    RED.nodes.createNode(node, config);

    const evtOn = `macro.${config.macro}.on`;
    const evtOff = `macro.${config.macro}.off`;

    eventBus.on(evtOn, null, handleOn);
    eventBus.on(evtOff, null, handleOff);

    node.on('close', () => {
      (<any> eventBus).removeListener(evtOn, null, handleOn);
      (<any> eventBus).removeListener(evtOff, null, handleOff);
    });

    function handleOn(e) {
      node.send([{
        topic: `macro/${config.macro}/on`,
        payload: e.data
      }, null]);
    }

    function handleOff(e) {
      node.send([null, {
        topic: `macro/${config.macro}/off`,
        payload: e.data
      }]);
    }
  }

  RED.nodes.registerType("macro-switch in", MacroSwitchNode);
};
