// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <header>
      <nav>
      <div className="logoDiv">
        <NavLink className="logoLink" exact to="/"><i className="fa-brands fa-airbnb"></i>HeirErrBnB</NavLink>
      </div>
        {isLoaded && (
        <div className="navMenuDiv">
            <NavLink className="createSpotLink" exact to="/spots/new">Create a New Spot</NavLink>
            <ProfileButton user={sessionUser} />
        </div>
        )}
        </nav>
    </header>
  );
}

export default Navigation;
