require('rx');

const { run } =  require('@cycle/xstream-run');
const { makeHTTPDriver } = require('@cycle/http');
const { makeDOMDriver, button, h1, div, a } = require('@cycle/dom');

const main = sources => {
  const clickEvent$ = sources.DOM
    .select('.get-first')
    .events('click');

  const request$ = clickEvent$.map(() => ({
    url: 'http://jsonplaceholder.typicode.com/users/1',
    category: 'user',
  }));

  const response$ = sources.HTTP
    .select('user')
    .flatten();

  const firstUser$ = response$.map(res => res.body)
    .startWith(undefined);

  return {
    DOM: firstUser$.map(firstUser =>
      div([
        button('.get-first', 'Get first user'),
        !firstUser ? undefined : div('.user-details', [
          h1('.user-name', firstUser.name),
          a('.user-website', { href: firstUser.website }, firstUser.website),
        ]),
      ])
    ),
    HTTP: request$,
  };
};

const drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
};

run(main, drivers);
