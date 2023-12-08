import ReactDOM from 'react-dom/client';
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useParams, useLocation } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      
      <div>hello world</div>
    );
  }
}

const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(<App/>);