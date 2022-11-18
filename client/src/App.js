import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import { DataProvider } from './GlobalState'
import Header from './components/headers/Header';
import Pages from './components/mainpages/Pages';

function App() {
  
  // console.log(process.env.REACT_APP_API_URL);
  return (
    <DataProvider>
      <BrowserRouter>
        <div className='App'>
          <Header />
          <Pages />
        </div>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
