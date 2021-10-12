import React from 'react';
import ReactDOM from 'react-dom';
import Anagram from './lib/components';
import './App.css';

ReactDOM.render(
    <React.StrictMode>
        <div>
            <h1>React Anagram Animation</h1>
            <h2>Demo</h2>

            <Anagram words={["bad credit", "debit card"]} fontToObserve={{ family: 'Open Sans' }} />

            <br/>
            <br/>
            <br/>
            <br/>

            <Anagram fontToObserve={{ family: 'Open Sans' }} animationOptions={{
                waitToStart: 5000,
                randomStartMin: 0,
                randomStartMax: 0,
                randomReverseMin: 6000,
                randomReverseMax: 6000,
                loopAnimation: 20000,
            }} />

            <br/>
            <br/>
            <br/>
            <br/>

            <Anagram fontToObserve={{ family: 'Open Sans' }} words={['Maria Annotating Camera', 'React Anagram Animation']} />
        </div>
    </React.StrictMode>,
    document.getElementById('root'),
);
