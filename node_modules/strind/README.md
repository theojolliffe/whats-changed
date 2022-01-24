# strind

[![NPM][npm]][npm-url]
[![Build][build]][build-badge]
[![Coverage][codecov-shield]][codecov]

> Partition strings based on character indices.

## Install

```bash
yarn add strind
```

## Usage

```js
import strind from 'strind';

const result = strind('abcd', [[1, 1], [2, 6]]);

console.log(result);
/**
 * {
      matched: ['b', 'cd'],
      unmatched: [
        {
          chars: 'a',
          index: 0
        }
      ]
    }
 *
 */
```

### Callback

An optional callback function can be passed as the third argument.

The function is called with the substring `chars` and boolean `matches` if the substring matches the array indices.

```js
import strind from 'strind';

const result = strind('abcd', [[1, 1], [2, 6]], ({ chars, matches }) => {
  return {
    text: chars,
    isHighlighted: matches
  };
});

console.log(result);
/**
 * [
      { isHighlighted: false, text: 'a' },
      { isHighlighted: true, text: 'b' },
      { isHighlighted: true, text: 'cd' }
    ]
 *
 */
```

## [Changelog](CHANGELOG.md)

## License

[MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/strind.svg?color=blue
[npm-url]: https://npmjs.com/package/strind
[build]: https://travis-ci.com/metonym/strind.svg?branch=master
[build-badge]: https://travis-ci.com/metonym/strind
[codecov]: https://codecov.io/gh/metonym/strind
[codecov-shield]: https://img.shields.io/codecov/c/github/metonym/strind.svg
