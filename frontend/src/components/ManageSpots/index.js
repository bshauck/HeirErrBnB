// frontend/src/components/ManageSpots/index.js
import { useDispatch, useSelector } from 'react-redux';

import { thunkREADAllUserSpots } from '../../store/spots';
import SpotTile from '../SpotTile';
import { useEffect } from 'react';


const ManageSpots = () => {
    const sessionUser = useSelector(state => state.session.user);
    const spots = useSelector(state => state.spots?.userSpots)
    const dispatch = useDispatch();

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


    return (
        <div className="manageSpotsDiv">
            {(!Object.keys(spots).length && <p>No spots! Boo hoo</p>) ||
            Object.values(spots).map(s => (
                <SpotTile key={s.id} spot={s} isManaged={true} />
            ))}
        </div>
    );
}

export default ManageSpots ;
