// frontend/src/components/SpotList/index.js

import { useDispatch, useSelector } from 'react-redux';
import './SpotList.css';
import { thunkREADAllSpots } from '../../store/spots';
import SpotTile from '../SpotTile';

function SpotList () {
    const spots = useSelector(state => state.spots?.allSpots);
    console.log("🚀 ~ file: index.js:11 ~ SpotList ~ spots:", spots)
    const dispatch = useDispatch();
    console.log("🚀 ~ file: index.js:12 ~ SpotList ~ useDispatch:", useDispatch)

    if (!spots || !Object.keys(spots).length) {
        dispatch(thunkREADAllSpots())
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
