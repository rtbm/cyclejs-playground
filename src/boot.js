const Rx = require('rx');

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

const run = (mainFn, drivers) => {
  const proxySources = {};

  Object.keys(drivers).forEach(key => {
    proxySources[key] = new Rx.Subject();
  });

  const sinks = mainFn(proxySources);

  Object.keys(drivers).forEach(key => {
    const source = drivers[key](sinks[key]);
    source.subscribe(x => proxySources[key].onNext(x));
  });
};

const drivers = {
  DOM: DOMDriver,
  //Log: consoleLogDriver,
};

run(main, drivers);
