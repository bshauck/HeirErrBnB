// frontend/src/components/ManageSpots/index.js
// import { useState } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { thunkReadAllUserSpots } from '../../store/spots';
import SpotTile from '../SpotTile';

const ManageSpots = () => {
    const user = useSelector(state => state.session.user);
    const spotIds = useSelector(state => state.session.spots)
    const dispatch = useDispatch();
    const history = useHistory();

    const [ref] = useState({current:{}});
    if (!spotIds || !Array.isArray(spotIds)) {
        if (!ref.current[user.id]) ref.current[user.id] = dispatch(thunkReadAllUserSpots())
        return null;
    } else if (ref.current[user.id]) delete ref.current[user.id]

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
          <div className="spotListDiv">
          {spotIds.map(s => (
                <SpotTile key={s} spotId={s} isManaged={true} />
            ))}
          </div>
        </div>
        </>
    );
}

export default ManageSpots ;
