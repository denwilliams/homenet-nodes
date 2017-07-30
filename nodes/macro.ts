import { IEventBus, ICommandManager } from '@homenet/core';

export = function(RED) {
  const global = RED.settings.functionGlobalContext;
  const eventBus: IEventBus = global.services.get('IEventBus');
  const commands: ICommandManager = global.services.get('ICommandManager');

  function MacroNode(config) {
    const node = this;
    RED.nodes.createNode(node, config);
    const evt = `macro.${config.macro}.executed`;

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

  function ExecuteMacroNode(config) {
    const node = this;
    RED.nodes.createNode(node, config);

    node.on('input', function(msg) {
      let args = msg.payload;
      if (!Array.isArray(args)) args = [args];
      commands.run(`macro.${config.macro}`, 'execute', args);
    });
  }

  RED.nodes.registerType("macro in", MacroNode);
  RED.nodes.registerType("macro out", ExecuteMacroNode);
};
