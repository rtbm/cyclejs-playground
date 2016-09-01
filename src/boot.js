require('rx');

const Cycle =  require('@cycle/core');
const { makeDOMDriver, div, input, label } = require('@cycle/dom');

const intent = DOMSource => DOMSource.select('.slider').events('input').map(e => e.target.value);

const model = (newValue$, props$) => {
  const initialValue$ = props$.map(props => props.init).first();
  const value$ = initialValue$.concat(newValue$);

  return Rx.Observable.combineLatest(value$, props$, (value, props) => ({
    handler: props.handler,
    label: props.label,
    unit: props.unit,
    min: props.min,
    max: props.max,
    value,
  }));
};

const view = state$ => state$.map(state => div(`.slider .${ state.handler }`, [
  label(`${ state.label }: ${ state.value } ${ state.unit }`),
  input('.slider', { attrs: { type: 'range', min: state.min, max: state.max, value: state.value }}),
]));

const Slider = sources => {
  const change$ = intent(sources.DOM);
  const state$ = model(change$, sources.props);
  const $vtree = view(state$);

  return {
    DOM: $vtree,
  };
};

const main = sources => {
  const heightProps$ = Rx.Observable.of({
    handler: 'height',
    label: 'Height',
    unit: 'cm',
    min: 40,
    max: 250,
    init: 170,
  });

  const heightSinks = Slider({
    DOM: sources.DOM.select('.height'),
    props: heightProps$,
  });

  const weightProps$ = Rx.Observable.of({
    handler: 'weight',
    label: 'Weight',
    unit: 'kg',
    min: 1,
    max: 350,
    init: 170,
  });

  const weightSinks = Slider({
    DOM: sources.DOM.select('.weight'),
    props: weightProps$,
  });

  const vtree$ = Rx.Observable.combineLatest(
    heightSinks.DOM, weightSinks.DOM, (weightVTree, heightVTree) => div([
      heightVTree,
      weightVTree,
    ])
  );

  return {
    DOM: vtree$,
  };
};

const drivers = {
  DOM: makeDOMDriver('#app'),
};

Cycle.run(main, drivers);
