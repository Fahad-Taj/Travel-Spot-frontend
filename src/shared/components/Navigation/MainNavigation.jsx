import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import MainHeader from './MainHeader';
import BackDrop from '../UIElements/Backdrop'
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import './MainNavigation.css';

const MainNavigation = (props) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const openDrawerHandler = () => {
    setIsDrawerOpen(true);
  }

  const closeDrawerHandler = () => {
    setIsDrawerOpen(false);
  }

  return (
    <React.Fragment>
      {isDrawerOpen && <BackDrop onClick={closeDrawerHandler}/>}
      <SideDrawer show={isDrawerOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={openDrawerHandler}>
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">YourPlaces</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
