React Anagram Animation
====

A React component to use CSS animations to swap letters in 2 words which are an anagram of each other.

The text is animated in position after calculating initial and final positions of each letter.

Install
----

`yarn add react-anagram-animation`

Demo
----

[DEMO](https://codesandbox.io/s/pcszv)

[CodeSandbox](https://pcszv.csb.app/)

Usage
----

```js
import React from 'react';
import Anagram from 'react-anagram-animation';

export default function MyComponent() {
    return (
        <Anagram words={['React Anagram Animation', 'Magenta Raincoat Airman']} />
    );
}
```

If you are using an embedded font and need to wait for it to load before animating, 
then you should specify the font `family` name and/or other font specifics.

```js
<Anagram family="Open Sans" />
```
```js
<Anagram family="Montserrat" weight="bold" />
```
```js
<Anagram family="Roboto" weight="600" style="italic" stretch="expanded" />
```

Props
----

- `words`: {array} - An array containing exactly 2 words which are an anagram of each other - `['NIGHT', 'THING']`

The following props are passed along to [Font Face Observer](https://github.com/iamskok/use-font-face-observer)

- `family` {string} - The font-family: `Open Sans`, `Roboto`, `Montserrat` etc
- `weight` {string|number} - The font-weight: `normal`, `bold`, `800`, etc
- `style` {string} - The font-style: `normal`, `italic`, `oblique`
- `stretch` {string} - The font stretch: `normal`, `condensed`, `expanded`, etc

Run Locally
----

To run demo locally:

- `yarn`
- `yarn start`

and a browser will open to the demo.


License
----

WTFPL
