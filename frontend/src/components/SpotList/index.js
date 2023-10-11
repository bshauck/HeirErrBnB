// frontend/src/components/SpotList/index.js
import { useDispatch, useSelector } from 'react-redux';
import { thunkReadAllSpots } from '../../store/spots';
import SpotTile from '../SpotTile';
import { useRef } from 'react';

function SpotList () {
    const spots = useSelector(state => state.spots.id)
    const dispatch = useDispatch()
    const ref = useRef({});
    const refKey = "firstSpotRead"

    if (!spots || Object.values(spots).length < 2) {
        if (!ref.current[refKey]) ref.current[refKey] = dispatch(thunkReadAllSpots())
        return null;
    } else if (ref.current[refKey]) delete ref.current[refKey]

    return (
        <div className="spotListDiv">
          {Object.values(spots).map(s => (
              <SpotTile key={s.id} spot={s} isManaged={false} />
          ))}
        </div>
    );
}

export default SpotList ;
