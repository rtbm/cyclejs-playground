const Rx = require('rx');
const Cycle = require('@cycle/core');

const main = sources => {
  const click$ = sources.DOM;
  const sinks = {
    DOM: click$
      .startWith(null)
      .flatMapLatest(() =>
        Rx.Observable.timer(0, 1000)
          .map(i => `Seconds elapsed ${i}`)
      ),
    Log: Rx.Observable.timer(0, 2000).map(i => 2 * i),
  };

  return sinks;
};

const DOMDriver = text$ => {
  text$.subscribe(text => {
    const container = document.querySelector('#app');
    container.textContent = text;
  });

  return Rx.Observable.fromEvent(document, 'click');
};

const consoleLogDriver = msg$ => {
  msg$.subscribe(msg => console.log(msg));
};

const drivers = {
  DOM: DOMDriver,
  Log: consoleLogDriver,
};

Cycle.run(main, drivers);
