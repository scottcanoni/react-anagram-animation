import React from 'react';
import ReactDOM from 'react-dom';
import Anagram from './lib/components/index';
import './App.css';

ReactDOM.render(
    <React.StrictMode>
        <div>
            <h1>React Anagram Animation</h1>
            <h2>Demo</h2>

            <Anagram family="Open Sans" />
        </div>
    </React.StrictMode>,
    document.getElementById('root'),
);
