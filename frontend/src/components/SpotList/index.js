// frontend/src/components/SpotList/index.js
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { thunkReadAllSpots } from '../../store/spots';
import SpotTile from '../SpotTile';

function SpotList () {
    const spots = useSelector(state => state.spots.id)
    const dispatch = useDispatch()
    const ref = useRef({});
    const refKey = "firstSpotRead"
    console.log("🚀 invoking SpotList ~ spots:", spots)
    const pageSize = 25;

    /* always have a full page of spots (can lose on browser refresh) */
    if (!spots || Object.values(spots).length < pageSize) {
        if (!ref.current[refKey]) ref.current[refKey] = dispatch(thunkReadAllSpots())
        return null;
    } else if (ref.current[refKey]) delete ref.current[refKey]

    console.log("rendering SpotList")
    return (
        <div className="spotListDiv">
          {Object.values(spots).map(s => (
              <SpotTile key={s.id} spotId={s.id} spot={s} isManaged={false} />
          ))}
        </div>
    );
}

export default SpotList ;
