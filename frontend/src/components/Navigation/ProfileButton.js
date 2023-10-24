import { useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';

import { thunkLogout } from '../../store/session';
import { thunkReadAllUserBookings } from "../../store/bookings";
import { thunkReadAllUserSpots } from "../../store/spots";
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);
    document.addEventListener('scroll', closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu)
      document.removeEventListener("scroll", closeMenu)
  };
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const createButtonClassName = "createSpotButton" + (user ? "" : " hidden");
  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const memoizedNavMenuDiv = useMemo(() => {
    const logout = (e) => {
      e.preventDefault();
      dispatch(thunkLogout());
      closeMenu();
      history.push("/");
    };
    const manageBookings = (e) => {
      e.preventDefault();
      dispatch(thunkReadAllUserBookings());
      closeMenu();
      history.push("/bookings/current");
    };
    const manageSpots = (e) => {
      e.preventDefault();
      dispatch(thunkReadAllUserSpots());
      closeMenu();
      history.push("/spots/current");
    };
      function handleCreateClick() {
      history.push("/spots/new")
    }
    const openMenu = () => {
      if (showMenu) return;
      setShowMenu(true);
    }
    return (
      <div className="navMenuDiv">
        <button type="button" className={createButtonClassName} onClick={handleCreateClick}>Create a New Spot</button>
        <button className="profileButton" onClick={openMenu}>
          <i className="fas fa-bars"></i>
          <i className="fas fa-user-circle" />
        </button>
        <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li className="loggedInMenuTextItem">Hello, {user.firstName}</li>
            <li className="loggedInMenuTextItem">{user.email}</li>
            <li>
            <hr></hr>
              <button type="button" className="manageBookingsButton" onClick={manageBookings}>Trips</button>
              <button type="button" className="manageSpotsButton" onClick={manageSpots}>Manage Spots</button>
            <hr></hr>
            </li>
            <li>
              <button className="logoutButton" onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              id="loginMenuItem"
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              id="signupMenuItem"
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
      </div>
      )
  }, [createButtonClassName, history, showMenu, dispatch, ulClassName, user]);

  return (
    <>
      {memoizedNavMenuDiv}
    </>
  );
}

export default ProfileButton;
