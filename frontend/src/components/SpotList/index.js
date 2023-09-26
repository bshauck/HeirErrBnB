// frontend/src/components/SpotList/index.js

import { useDispatch, useSelector } from 'react-redux';
import './SpotList.css';
import { thunkREADAllSpots } from '../../store/spots';
import SpotTile from '../SpotTile';

function SpotList () {
    const spots = useSelector(state => state.spots?.allSpots);
    console.log("🚀 ~ file: index.js:11 ~ SpotList ~ spots:", spots)
    const dispatch = useDispatch();

    if (!spots || !Object.keys(spots).length) {
        const result = dispatch(thunkREADAllSpots())
            .then((obj) => console.log("🚀 ~ file: index.js:13 ~ SpotList ~ obj, result:", obj, result))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    throw new Error(data.errors)
                    // return null;
                }
            });
        return null;
    }

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     setErrors({});
    //     return dispatch(sessionActions.login({ credential, password }))
    //       .then(closeModal)
    //       .catch(async (res) => {
    //         const data = await res.json();
    //         if (data && data.errors) {
    //           setErrors(data.errors);
    //         } else history.push("/")
    //       });
    //   };


    return (
        <div className="spotListDiv">
          {Object.values(spots).map(s => (
              <SpotTile key={s.id} spot={s} isManaged={false} />
          ))}
        </div>
    );
}

export default SpotList ;
