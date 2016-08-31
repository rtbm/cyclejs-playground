const Rx = require('rx');
const Cycle = require('@cycle/core');

const main = sources => {
  const click$ = sources.DOM;
  const sinks = {
    DOM: click$
      .startWith(null)
      .flatMapLatest(() =>
        Rx.Observable.timer(0, 1000)
          .map(i => ({
            tagName: 'H1',
            children: [{
              tagName: 'SPAN',
              children: [
                `Second elapsed: ${i}`,
              ],
            }],
          }))
      ),
    Log: Rx.Observable.timer(0, 2000).map(i => 2 * i),
  };

  return sinks;
};

const DOMDriver = text$ => {
  const createElement = obj => {
    const el = document.createElement(obj.tagName);

    obj.children
      .filter(c => typeof c === 'object')
      .map(createElement)
      .forEach(c => el.appendChild(c));

    obj.children
      .filter(c => typeof c === 'string')
      .forEach(c => el.innerHTML += c);

    return el;
  };

  text$.subscribe(obj => {
    const container = document.querySelector('#app');
    container.innerHTML = '';
    const el = createElement(obj);
    container.appendChild(el);
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
