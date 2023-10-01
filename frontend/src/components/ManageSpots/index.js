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
        <div className="manageSpotsDiv">
          {(!Object.keys(spots).length && <button type="button" className="createManageSpotButton" onClick={handleCreateClick}>Create a New Spot</button>) ||
            Object.values(spots).map(s => (
                <SpotTile key={s.id} spot={s} isManaged={true} />
            )
            )}
        </div>
    );
}

export default ManageSpots ;
