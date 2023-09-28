import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { thunkREADAllUserSpots } from "../../store/spots";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push("/");
  };

  const manageSpots = (e) => {
    e.preventDefault();
    dispatch(thunkREADAllUserSpots());
    closeMenu();
    history.push("/spots/current");
  };

  function handleCreateClick() {
         history.push("/spots/new")
  }

  const createButtonClassName = "createSpotButton" + (user ? "" : " hidden");
  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");


        <div className="navMenuDiv">
         <button type="button" className={createButtonClassName} onClick={handleCreateClick}>Create a New Spot</button>
         <button className="profileButton" onClick={openMenu}>
           <i class="fas fa-bars"></i>
           <i className="fas fa-user-circle" />
         </button>
       </div>

  return (
    <>
      <div className="navMenuDiv">
        <button type="button" className={createButtonClassName} onClick={handleCreateClick}>Create a New Spot</button>
        <button className="profileButton" onClick={openMenu}>
          <i class="fas fa-bars"></i>
          <i className="fas fa-user-circle" />
        </button>
      </div>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li className="loggedInMenuTextItem">Hello, {user.firstName}</li>
            <li className="loggedInMenuTextItem">{user.email}</li>
            <li>
            <hr></hr>
              <button className="manageSpotsButton" onClick={manageSpots}>Manage Spots</button>
            <hr></hr>
            </li>
            <li>
              <button className="logoutButton" onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              className="profileMenuItem"
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
            <OpenModalMenuItem
              className="profileMenuItem"
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
