const NAME = 'sensor';
import { ISensorManager } from 'homenet-core';

export = function(RED) {

  var global = RED.settings.functionGlobalContext;
  console.log(global);
  var sensors: ISensorManager = global.sensors;

  function NodeOut(config) {
    var self = this;
    var node = this;

    RED.nodes.createNode(this,config);

    var sensorId = config.sensorId;
    var sensor = sensors.getInstance(sensorId);
    var value = config.value;

    this.on('input', function(msg) {
      const sensorAny = <any> sensor;
      if (sensorAny.trigger) sensorAny.trigger(value || msg.payload);
    });
  }

  function NodeIn(config) {
    RED.nodes.createNode(this, config);

    var self = this;
    var node = this;

    var sensorId = config.sensorId;
    console.log('sens', sensorId);
    var sensor = sensors.getInstance(sensorId);

    sensor.on('trigger', onSensorTrigger);

    this.on('close', function() {
      sensor.removeListener('trigger', onSensorTrigger);
    });

    function onSensorTrigger(data) {
      var msg = {
        topic: 'sensor/'+sensorId,
        payload: data
      };
      node.send(msg);
    }
  }

  RED.nodes.registerType(NAME+' in', NodeIn);
  RED.nodes.registerType(NAME+' out', NodeOut);
};
