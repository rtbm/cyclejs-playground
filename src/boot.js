require('rx');

const Cycle =  require('@cycle/core');
const { makeDOMDriver, div, input, label } = require('@cycle/dom');

const intent = DOMSource => ({
  heightChange$: DOMSource.select('.height').events('input').map(e => e.target.value),
  weightChange$: DOMSource.select('.weight').events('input').map(e => e.target.value),
});

const model = (heightChange$, weightChange$) => Rx.Observable.combineLatest(
  heightChange$.startWith(80),
  weightChange$.startWith(80),
  (height, weight) => ({
    height,
    weight,
    bmi: Math.round(weight / ((height * 0.01) * (height * 0.01)))
  })
);

const view = state$ => state$.map(state => div([
  div('.bmi', `BMI: ${state.bmi}`),
  label(`Height: ${ state.height }`),
  input('.height', { attrs: { type: 'range', min: 1, max: 350, value: state.height }}),
  label(`Weight: ${ state.weight }`),
  input('.weight', { attrs: { type: 'range', min: 1, max: 250, value: state.weight }}),
]));

const main = sources => {
  const { heightChange$, weightChange$ } = intent(sources.DOM);
  const state$ = model(heightChange$, weightChange$);
  const $vtree = view(state$);

  return {
    DOM: $vtree
  }
};

const drivers = {
  DOM: makeDOMDriver('#app'),
};

Cycle.run(main, drivers);
