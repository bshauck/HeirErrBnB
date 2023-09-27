// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

/* add the following somewhere to attribute icon */
/* <a  href="https://icons8.com/icon/FP98HhFhGLsf/mansion">Mansion</a> icon by <a href="https://icons8.com">Icons8</a> */

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const history = useHistory();

  function handleCreateClick() {
    history.push("/spots/new")
  }


  return (
    <header>
      <div className="logoDiv">
        <NavLink className="logoLink" exact to="/"><img width="32" height="32" src="https://img.icons8.com/color/32/mansion.png" alt="mansion"/>HeirErrBnB</NavLink>
      </div>
        {isLoaded && (
        <div className="navMenuDiv">
            <button type="button" className="createSpotButton" onClick={handleCreateClick}>Create a New Spot</button>
            <ProfileButton user={sessionUser} />
        </div>
        )}
    </header>
  );
}

export default Navigation;
