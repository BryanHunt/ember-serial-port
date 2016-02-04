import Ember from 'ember';

const { Service, computed } = Ember;

export default Service.extend({
  serialPortFactory: window.require("serialport"),

  init() {
    this.set('baudRate', 9600);
    this.set('dataBits', 8);
    this.set('stopBits', 1);
    this.set('parity', 'none');
    this.set('flowControl', false);
    this.set('rtscts', false);
    this.set('xon', false);
    this.set('xoff', false);
    this.set('xany', false);
    this.set('hupcl', true);
    this.set('rts', true);
    this.set('cts', false);
    this.set('dtr', true);
    this.set('dts', false);
    this.set('brk', false);
    this.set('bufferSize', 255);
  },

  openPorts: computed(() => {
    return {};
  }),

  fetchPorts() {
    let serialPortFactory = this.get('serialPortFactory');

    return new Promise((resolve, reject) => {
      serialPortFactory.list((error, ports) => {
        if(error) {
          reject(error);
        } else {
          resolve(ports.mapBy('comName'));
        }
      });
    })
  },

  open(port, options = {}) {
    let _this = this;
    let ports = this.get('openPorts');

    if (Ember.isPresent(ports[port])) {
      return Ember.RSVP.resolve(ports[port]);
    }

    let defaults = this.getProperties([
      'baudRate',
      'dataBits',
      'stopBits',
      'parity',
      'rtscts',
      'xon',
      'xoff',
      'xany',
      'flowControl',
      'bufferSize'
    ]);

    options = Ember.merge(options, defaults);

    return SerialPort.initialize(port, options)
      .then((serialPort) => _this.set(`openPorts.${port}`, serialPort));
  }
});
