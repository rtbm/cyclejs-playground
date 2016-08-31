require('rx');

const Cycle = require('@cycle/core');
const { button, p, label, div, makeDOMDriver } = require('@cycle/dom');

const main = sources => {
  const decrementClick$ = sources.DOM.select('.decrement').events('click');
  const incrementClick$ = sources.DOM.select('.increment').events('click');
  const decrementAction$ = decrementClick$.map(e => -1);
  const incrementAction$ = incrementClick$.map(e => +1);

  const number$ = Rx.Observable.of(10)
    .merge(decrementAction$).merge(incrementAction$)
    .scan((prev, curr) => prev + curr);

  return {
    DOM: number$.map(number =>
      div([
        button('.decrement', 'Decrement'),
        button('.increment', 'Increment'),
        p([
          label(String(number)),
        ])
      ])
    )
  };
};

const drivers = {
  DOM: makeDOMDriver('#app'),
};

Cycle.run(main, drivers);
