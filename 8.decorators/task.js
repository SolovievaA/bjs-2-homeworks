//Задача № 1
const md5 = require('js-md5');
function cachingDecoratorNew(func) {
  let cache = [];
  function wrapper(...args) {
    const hash = md5(JSON.stringify(args));
    let objectInCache = cache.find( item => item.hash === hash);
    if (objectInCache) {
      console.log('Из кэша: ' + objectInCache.value,cache);
    return 'Из кэша: ' + objectInCache.value}
    let result = func(...args);
    cache.push({"hash": hash, "value": result});
    if (cache.length > 5) {
      cache.shift();
    }
    console.log('Вычисляем: ' + result, cache);
    return "Вычисляем: " + result;
  }
  return wrapper;
}
const addAndMultiply = (a, b, c) => (a + b) * c;
const upgraded = cachingDecoratorNew(addAndMultiply);
upgraded(1, 2, 3); // вычисляем: 9
upgraded(1, 2, 3); // из кеша: 9
upgraded(2, 2, 3); // вычисляем: 12
upgraded(3, 2, 3); // вычисляем: 15
upgraded(4, 2, 3); // вычисляем: 18
upgraded(5, 2, 3); // вычисляем: 21
upgraded(6, 2, 3); // вычисляем: 24 (при этом кеш для 1, 2, 3 уничтожается)
upgraded(1, 2, 3); // вычисляем: 9  (снова вычисляем, кеша нет)

//Задача № 2

function debounceDecoratorNew(func, delay) {
  let timeoutId;
  let count = 0;
  let allCount = 0;
 
  function wrapper(...args) {
    if (timeoutId) {
    console.log('Уже есть таймаут', args);
    clearTimeout(timeoutId);
    allCount++;
    }
    if (timeoutId) {
      console.log('Первый сигнал', args);
      func.apply(this, args);
      count++;
    }
    timeoutId = setTimeout(() => {
      console.log('задержка больше 2000мсек, сработал таймаут', args);
      count++;
      func.apply(this, args);
      wrapper.count = count;
  }, delay);
    wrapper.allCount = allCount;
  }  
  return wrapper;
}
const sendSignal = (signalOrder, delay) => console.log("Сигнал отправлен", signalOrder, delay);
const upgradedSendSignal = debounceDecoratorNew(sendSignal, 2000);
setTimeout(() => upgradedSendSignal(1, 0)); // Сигнал отправлен + будет запланирован асинхронный запуск, который будет проигнорирован, так как следующий сигнал отменит предыдущий (300 - 0 < 2000)
setTimeout(() => upgradedSendSignal(2, 300), 300); // проигнорировано, так как следующий сигнал отменит предыдущий (900 - 300 < 2000)
setTimeout(() => upgradedSendSignal(3, 900), 900); // проигнорировано, так как следующий сигнал отменит предыдущий (1200 - 900 < 2000)
setTimeout(() => upgradedSendSignal(4, 1200), 1200); // проигнорировано, так как следующий сигнал отменит предыдущий (2300 - 1200 < 2000)
setTimeout(() => upgradedSendSignal(5, 2300), 2300); // Сигнал отправлен, так как следующий вызов не успеет отменить текущий: 4400-2300=2100 (2100 > 2000)
setTimeout(() => upgradedSendSignal(6, 4400), 4400); // проигнорировано, так как следующий сигнал отменит предыдущий (4500 - 4400 < 2000)
setTimeout(() => upgradedSendSignal(7, 4500), 4500); // Сигнал будет отправлен, так как последний вызов debounce декоратора (спустя 4500 + 2000 = 6500) 6,5с
setTimeout(() => {
  console.log(upgradedSendSignal.count); // было выполнено 3 отправки сигнала
  console.log(upgradedSendSignal.allCount);
}, 7000) // было выполнено 6 вызовов декорированной функции
