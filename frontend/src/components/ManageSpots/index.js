// frontend/src/components/ManageSpots/index.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { thunkREADAllUserSpots } from '../../store/spots';
import SpotTile from '../SpotTile';


const ManageSpots = () => {
    const sessionUser = useSelector(state => state.session.user);
    const spots = useSelector(state => state.spots?.userSpots)
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        async function getUserSpots() {
            await dispatch(thunkREADAllUserSpots());
        }
        if (!sessionUser) return null;
        if (!spots) getUserSpots();
    }, [spots, sessionUser, dispatch]);

    if (!sessionUser) return null;
    if (!spots) {
        (async() => await dispatch(thunkREADAllUserSpots()))();
        return null;
    }

    function handleCreateClick() {
        history.push("/spots/new")
    }

    return (
        <>
        <div className="manageSpotsHeaderDiv">
          <h1>Manage Spots</h1>
          <button type="button"
          className="createManageSpotButton" onClick={handleCreateClick}>Create a New Spot</button>
          </div>
        <div className="manageSpotsDiv">
          <div className="manageSpotTilesDiv">
          {Object.values(spots).map(s => (
                <SpotTile key={s.id} spot={s} isManaged={true} />
            ))}
          </div>
        </div>
        </>
    );
}

export default ManageSpots ;
