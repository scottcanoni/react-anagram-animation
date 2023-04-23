React Anagram Animation
====

A React component to use CSS animations to swap letters in 2 words which are an anagram of each other.

The text is animated in position after calculating initial and final positions of each letter.

Install
----

`yarn add react-anagram-animation`

or

`npm install react-anagram-animation`

Demo
----

[DEMO](https://pcszv.csb.app/)

[CodeSandbox](https://codesandbox.io/s/pcszv)

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

To control the animation speed and timing, you can pass an object of `animationOptions`.

```js
<Anagram animationOptions={{
    randomStartMin: 0,
    randomStartMax: 0,
    randomReverseMin: 6000,
    randomReverseMax: 6000,
    loopAnimation: 20000,
    waitToStart: 5000,
    transitionDuration: 2000,
    timingFunction: 'ease-in-out',
}} />
```

If you are using an embedded font and need to wait for it to load before animating,
then you should specify the `fontToObserve` property with the font family name.

```js
<Anagram fontToObserve="Open Sans" />
```
```js
<Anagram fontToObserve="Roboto" />
```

API
----

### Props

| Prop               | Type   | Default                                                  | Description                                                                                                            |
| :----------------- |:-------|:---------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------|
| `words`            | array  | `['React Anagram Animation', 'Magenta Raincoat Airman']` | An array containing exactly 2 words which are an anagram of each other.                                                |
| `animationOptions` | object | `AnimationOptions`                                       | Timing options for when to start, how fast to animate forwards, backwards, and when to loop (optional).                |
| `fontToObserve`    | string |                                                          | The name of an embedded font to wait until loaded.  If not specified, animation will be loaded immediately (optional). |

#### AnimationOptions

All time values are in # of milliseconds.  The randomness allows a nice jumble effect.  You can use any values you want to create some fascinating animations.

| Property             | Type   | Default       | Description                                                                                                                           |
| :------------------- | :----- |:--------------|:--------------------------------------------------------------------------------------------------------------------------------------|
| `randomStartMin`     | number | `0`           | The minimum amount of time to randomly wait before starting to animate each letter.                                                   |
| `randomStartMax`     | number | `3000`        | The maximum amount of time to randomly wait before starting to animate each letter. Should be `>= randomStartMin`.                    |
| `randomReverseMin`   | number | `6000`        | The minimum amount of time to randomly wait before starting to animate each letter in reverse.                                        |
| `randomReverseMax`   | number | `9000`        | The maximum amount of time to randomly wait before starting to animate each letter in reverse. Should be `>= randomReverseMin`.       |
| `loopAnimation`      | number | `12000`       | The amount of time to wait before starting the next full loop of the animation. Should be `>= randomReverseMax + transitionDuration`. |
| `waitToStart`        | number | `0`           | The amount of time to wait before beginning the animation on start up the first time.                                                 |
| `transitionDuration` | number | `1000`        | How long should it take for a letter to move to its next position. Should be `<= randomReverseMin - randomStartMax`.                  |
| `timingFunction`     | string | `ease-in-out` | What [timing function](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function) should be used for the animation.  |

Run Locally
----

To run demo locally:

- `yarn`
- `yarn start`

and a browser will open to the demo.

If you receive `Invalid hook call` errors because you are linking this module, you may need to point this library's React to your app's installed React so there is only one copy.

```
npm link ../my-app/node_modules/react
npm link ../my-app/node_modules/react-dom
```

Future Ideas
----

- Animate between more than 2 words.
- Animate non-anagram words. [Done](https://www.npmjs.com/package/react-text-swap-animation).


License
----

WTFPL
