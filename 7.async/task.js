class AlarmClock {
    constructor() {
      this.alarmCollection = [];
      this.intervalId = null;
    }
    addClock(time, callback) {
      if (!time || !callback) {
        throw new Error('Отсутствуют обязательные аргументы');
      } if (this.alarmCollection.some(alarm => alarm.time === time)) {
        console.warn('Уже присутствует звонок на это же время');
      }
      const newAlarm = {
        time,
        callback,
        canCall: true
      };
      this.alarmCollection.push(newAlarm);
    }
    removeClock(time) {
      this.alarmCollection = this.alarmCollection.filter(
        alarm => alarm.time !== time
      );
    }
    getCurrentFormattedTime() {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      return '$(hours):$(minutes)';
    }
    start() {
      if (this.intervalId) {
        return;
      }
      this.intervalId = setInterval(() => {
        this.alarmCollection.forEach(alarm => {
          if (alarm.time === this.getCurrentFormattedTime() && alarm.canCall) {
            alarm.canCall = false;
            alarm.callback();
          }
        })
      }, 1000);
    }
    stop() {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    resetAllCalls() {
      this.alarmCollection.forEach(alarm => alarm.canCall = true);
    }
    clearAlarms() {
      this.stop();
      this.alarmCollection = [];
    }
  }
  
  function testCase() {
    const clock = new AlarmClock();
    const cb = function(time) {
      console.log('allarm ties ' + time);    
    }
    callback = f => f;
    clock.addClock('16:45', cb);
    console.log('1----------');
    console.log(clock.alarmCollection.length, 1);
    console.log(clock.alarmCollection[0].canCall, true);
    console.log(clock.alarmCollection[0].time, '16:45');
    console.log(clock.alarmCollection[0].callback, 'callback');  
    console.log('2----------');
  
    console.log(clock.intervalId, null);
  
    console.log('3----------');
    clock.addClock('16:45', f => f);
    clock.start();
    console.log(clock.intervalId, 'any id');
    clock.stop();
    
    console.log('4----------');
    console.log(clock.getCurrentFormattedTime(), '2 digits');
    console.log('5----');
    clock.start();
    console.log(clock.intervalId, 'any id');
    clock.stop();
    console.log(clock.intervalId, null);
    console.log('---- delete');
    clock.addClock('16:45', callback);
    clock.addClock('16:45', callback);
    clock.addClock('16:46', callback);
    clock.removeClock('16:45');
    console.log(clock.alarmCollection.length, 1);
  }
  
  testCase();