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
      <div className="logoDiv">
        <NavLink exact to="/"><i class="fa-brands fa-airbnb"></i>HeirErrBnB</NavLink>
      </div>
      <div className="menuDiv">
        {isLoaded && (
            <ProfileButton user={sessionUser} />
        )}
      </div>
    </header>
  );
}

export default Navigation;
