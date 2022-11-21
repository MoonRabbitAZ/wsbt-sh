import React from 'react';
import ReactDOM from 'react-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import App from './App';
import rootReducer from './reducers';
import customMiddleware from './middleware/api';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(customMiddleware)))

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

