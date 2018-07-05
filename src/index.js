// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker.js';

const root = document.getElementById('root')
if (root) {
ReactDOM.render(<App />, root);
registerServiceWorker();
} else {
	console.error("Couldn't find root node")
}
