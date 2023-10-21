// frontend/src/components/Navigation/index.js
import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';

/* add the following somewhere to attribute icon */
/* <a  href="https://icons8.com/icon/FP98HhFhGLsf/mansion">Mansion</a> icon by <a href="https://icons8.com">Icons8</a> */

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const memoizedLogoDiv = useMemo(() => {
    return (
      <div className="logoDiv">
        <NavLink className="logoLink2" exact to="/"><img width="32" height="32" src="https://img.icons8.com/color/32/mansion.png" alt="mansion"/></NavLink>
        <NavLink className="logoLink" exact to="/">HeirErrBnB</NavLink>
      </div>
    )
  }, []);

  return (
    <header>
      <nav>
        {memoizedLogoDiv}
          {isLoaded && (
            <ProfileButton user={sessionUser} />
          )}
        </nav>
    </header>
  );
}

export default Navigation;
