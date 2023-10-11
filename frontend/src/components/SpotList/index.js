// frontend/src/components/SpotList/index.js
import { useDispatch, useSelector } from 'react-redux';
import { thunkReadAllSpots } from '../../store/spots';
import SpotTile from '../SpotTile';

function SpotList () {
    const spots = useSelector(state => state.spots.id);
    const dispatch = useDispatch();

    if (!spots || Object.keys(spots).length < 2) {
        dispatch(thunkReadAllSpots())
        return null;
    }

    return (
        <div className="spotListDiv">
          {Object.values(spots).map(s => (
              <SpotTile key={s.id} spot={s} isManaged={false} />
          ))}
        </div>
    );
}

export default SpotList ;
