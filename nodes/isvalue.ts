export = function(RED) {
  function Node(config) {
    const node = this;

    RED.nodes.createNode(this, config);

    const { valueId, key, expectedValue } = config;
    const checkValue = JSON.parse(expectedValue);

    var values = RED.settings.functionGlobalContext.services.get('IValuesManager');

    this.on('input', function(msg) {
      const currentValue = values.get(valueId, null, key);

      if (currentValue === checkValue) node.send([msg,null]);
      else node.send([null,msg]);
    });
  }

  RED.nodes.registerType('isvalue', Node);
};
