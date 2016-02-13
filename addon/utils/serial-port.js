import Ember from 'ember';
import DS from 'ember-data';

const { computed, run } = Ember;
const { Promise } = Ember.RSVP;
const { PromiseArray } = DS;

const serialPortFactory = window.require("serialport");

export default Ember.Object.extend({

  close() {
    // TODO: unregister this port with the serial port service
    let driver = this.get('driver');

    return new Promise((resolve, reject) => {
      driver.close((error) => {
        if(error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  },

  read(size) {
    // TODO: handle async update and clearing of buffer
    // TODO: honor size param
    let buffer = this.get('buffer');
    this.set('buffer', []);
    return buffer;
  },

  write(data) {
    let driver = this.get('driver');

    return new Promise((resolve, reject) => {
      driver.write(data, (error) => {
        if(error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
});

SerialPort.openClass({
  initialize(port, options) {
    this.set('buffer', []);
    let _this = this;

    return new Promise((resolve, reject) => {
      let serialPortDriver = new serialPortFactory.SerialPort(port, options, true, (err) => {
        if(err) {
          reject(err);
        } else {
          serialPortDriver.on('data', (data) => _this.get('buffer').append(data));
          let serialPort = SerialPort.create({driver: serialPortDriver});
          resolve(serialPort);
        }
      });
    });
  }
});
