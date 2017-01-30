import { ISunlight } from '@homenet/core';

const name = 'dark';

export = function(RED) {
  var global = RED.settings.functionGlobalContext;
  var sunlight: ISunlight = global.services.get('ISunlight');

  function Node(n) {
    RED.nodes.createNode(this,n);

    var node = this;

    sunlight.on('light', check);

    this.on('close', function() {
      sunlight.removeListener('light', check);
    });

    function check(data) {
      var isTrue = (data === name || data.value === name);

      const msg = { payload: isTrue, topic:name };

      if (isTrue) node.send([msg,null]);
      else node.send([null,msg]);
    }
  }
  RED.nodes.registerType(name,Node);
};
