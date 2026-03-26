import { createRoot } from 'react-dom/client';
import Anagram from './lib/components';
import './App.css';

const rootElement = document.getElementById('root');

const root = createRoot(rootElement);
root.render(
    <div>
        <h1>React Anagram Animation</h1>
        <h2>Demo</h2>

        <Anagram words={['bad credit', 'debit card']} fontToObserve="Open Sans" />

        <br />
        <br />
        <br />
        <br />

        <Anagram animationOptions={{
            waitToStart: 5000,
            randomStartMin: 0,
            randomStartMax: 0,
            randomReverseMin: 6000,
            randomReverseMax: 6000,
            loopAnimation: 20000,
            transitionDuration: 1000,
            timingFunction: 'cubic-bezier(.43,-0.77,.52,1.56)',
        }} fontToObserve="Open Sans" />

        <br />
        <br />
        <br />
        <br />

        <Anagram words={['Maria Annotating Camera', 'React Anagram Animation']} fontToObserve="Open Sans" />
        <br />
        <br />
        <br />
        <br />

        <Anagram words={['Maria Annotating Camera', 'React Anagram Animation']} fontToObserve="Open Sans" animationOptions={{
            randomStartMin: 0,
            randomStartMax: 3000,
            randomReverseMin: 12000,
            randomReverseMax: 12000,
            loopAnimation: 20000,
            waitToStart: 0,
            transitionDuration: 4000,
            timingFunction: 'cubic-bezier(0.2,-2,0.8,2)'
        }} />
    </div>,
);
