import React, { useState } from 'react';

import './App.css';
import LoginPage from './Pages/LoginPage/LoginPage';
import HomePage from './Pages/HomePage/HomePage';
import SiteManagement from './Pages/SiteManagement/SiteManagement';


import HeaderPage from './components/HeaderPage/HeaderPage';
import MainNavbar from './components/MainNavbar/MainNavbar';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {reactLocalStorage} from 'reactjs-localstorage';
import OvenTest3 from './Pages/Module/OvenTest/OvenTest3';
import { ReferenceLine } from 'recharts';
import {Provider} from 'react-redux';
import store from "./store";


function App() { 
  const [activeUser, setActiveUser] = useState(reactLocalStorage.getObject('activeUser'));
  

     function onLogout(user)
     {
       setActiveUser(user);
       reactLocalStorage.setObject('activeUser', null);
     }

     function onLogin(user)
     {
       setActiveUser(user);
       reactLocalStorage.setObject('activeUser', user)
     }

    return (
      
    
          <>   
           <Provider store={store}>
          <React.Fragment>
            <BrowserRouter> 
              <HeaderPage activeUser={activeUser} onLogout={(user) => onLogout(null)} ></HeaderPage>
                {activeUser ? <MainNavbar ></MainNavbar> : ''} 
                <OvenTest3></OvenTest3>
                {/* <Routes>
                      <Route exact={true} path="/" element={<HomePage></HomePage>}/>
                      <Route exact={true} path="/login" element={<LoginPage/>}/>
                      <Route exact={true} path="/SiteManagement" element={<SiteManagement/>}/>
                      
                         <Route exact={true} path="/OvenTest3" element={<OvenTest3></OvenTest3>}></Route>
                  
                    
                      <Route exact={true} path="/ReferenceLine" element={<ReferenceLine/>}/>
                      
                </Routes> */}
            </BrowserRouter>
          </React.Fragment> 
          </Provider>
          </>   
  
    );
  
}

export default App;