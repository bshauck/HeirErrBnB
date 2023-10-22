// frontend/src/components/SpotList/index.js
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { thunkReadAllSpots } from '../../store/spots';
import SpotTile from '../SpotTile';

/* Challenge: to minimize duplicate db calls and useless rerenders
 * while following React hook rules. Use of useRef avoids renders,
 * but is only allowed in effects and event handlers; and with
 * current API, can only show interest in huge thing of "all spots"
 * since the ids are not known yet. If put into a useEffect, then
 * any time any change occurs that causes an change of any spot, this
 * would rerender. Instead, we use useState, but in a way that it
 * acts like useRef; because you are not supposed to READ/WRITE to
 * refs during rendering, including the part of the function before
 * the return; but that is allowed for useState. This strange use
 * of useState will be used throughout the application. If API is
 * rewritten to gather say a page's worth of spotIds for a given
 * user's set of interests, then this can be changed to a useEffect
 * with a useRef. To show that intent, the variable will be called
 * "ref"; but it will be used thusly: const [ref] = useState({current:{}}),
 * and changes will always happen through: ref.current[key] = value or
 * delete ref.current[key]; avoiding rerenders but allowing access for
 * both reading and writing DURING renders. (btw, useRef currently works
 * fine with read/writes before the return statement; but doc warns this
 * will change.) Future approach: more API to just return spotIds, and
 * have this component only know current user/null, current page size,
 * appropriate query to get spotIds, and just be dependent on changes
 * for spots with those spotIds.
 */

function SpotList () {
    const dispatch = useDispatch()
    const spots = useSelector(state => state.spots.id)
    const [ref] = useState({current:{}});
    const refKey = "firstSpotRead"
    const pageSize = 25;

    /* always have a full page of spots (can lose on browser refresh) */
    if (!spots || Object.values(spots).length < pageSize) {
        if (!ref.current[refKey]) ref.current[refKey] = dispatch(thunkReadAllSpots())
        return null;
    } else if (ref.current[refKey]) delete ref.current[refKey]

    return (
        <div className="outerSpotListDiv">
            <div className="spotListDiv">
                {Object.values(spots).map((s,i) => (
                    <SpotTile key={s.id} spotId={s.id} spot={s} isManaged={false} />
                ))}
            </div>
        </div>
    );
}

export default SpotList ;
