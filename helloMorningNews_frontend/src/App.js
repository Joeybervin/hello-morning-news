import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// ^ Mes components
import ScreenHome from './ScreenHome';
import ScreenMyArticles from './ScreenMyArticles';
import ScreenSource from './ScreenSource';
import ScreenArticlesBySource from './ScreenArticlesBySource';

//* Importation de Redux
import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';

// ^ Redux
import article from './reducers/ArticleReducer'
import user from './reducers/UserReducer'


//* Le store ou sera stocker tous mes états
const store = createStore(combineReducers({article, user}));

function App() {
  return (
    <Provider store={store}>
      <Router>
          <Switch>
            <Route path="/" exact component={ScreenHome} />
            <Route path="/ScreenMyArticles"  component={ScreenMyArticles} />
            <Route path="/ScreenSource"  component={ScreenSource} />
            <Route path="/ScreenArticlesBySource/:id"  component={ScreenArticlesBySource} />
          </Switch>
      </Router>
    </Provider>
  );
}

export default App;
