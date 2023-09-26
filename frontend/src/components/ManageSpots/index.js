// frontend/src/components/ManageSpots/index.js
import { useDispatch, useSelector } from 'react-redux';

import "./ManageSpots.css"
import { thunkREADALLUserSpots } from '../../store/spots';

import SpotTile from '../SpotTile';


const ManageSpots = () => {
    const sessionUser = useSelector(state => state.session.user);
    const spots = useSelector(state => state.spots?.userSpots)
    const dispatch = useDispatch();
    if (!sessionUser) return null;
    if (!spots) {
        dispatch(thunkREADALLUserSpots());
        return null;
    }

    return (
        <div className="manageSpotsDiv">
            {Object.values(spots).map(s => (
                <SpotTile key={s.id} spot={s} isManaged={true} />
            ))}
        </div>
    );
}

export default ManageSpots ;
