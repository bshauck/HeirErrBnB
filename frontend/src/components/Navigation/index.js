// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';

/* add the following somewhere to attribute icon */
/* <a  href="https://icons8.com/icon/FP98HhFhGLsf/mansion">Mansion</a> icon by <a href="https://icons8.com">Icons8</a> */

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <header>
      <div className="logoDiv">
        <NavLink className="logoLink2" exact to="/"><img width="32" height="32" src="https://img.icons8.com/color/32/mansion.png" alt="mansion"/></NavLink>
        <NavLink className="logoLink" exact to="/">HeirErrBnB</NavLink>
      </div>
        {isLoaded && (
          <ProfileButton user={sessionUser} />
        )}
    </header>
  );
}

export default Navigation;
