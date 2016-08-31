const Rx = require('rx');
const Cycle = require('@cycle/core');
const { h1, span, makeDOMDriver } = require('@cycle/dom');

const main = sources => {
  const mouseover$ = sources.DOM.select('span').events('mouseover');
  const sinks = {
    DOM: mouseover$
      .startWith(null)
      .flatMapLatest(() => Rx.Observable.timer(0, 1000)
        .map(i =>
          h1([
            span([
              `Second elapsed: ${i}`,
            ]),
          ])
        )
      ),
    Log: Rx.Observable.timer(0, 2000).map(i => 2 * i),
  };

  return sinks;
};

const consoleLogDriver = msg$ => msg$.subscribe(msg => console.log(msg));

const drivers = {
  DOM: makeDOMDriver('#app'),
  Log: consoleLogDriver,
};

Cycle.run(main, drivers);
