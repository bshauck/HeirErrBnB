// frontend/src/components/SpotEdit/index.js
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SpotForm from '../SpotForm';

/*
      "Spots": [
        {
          "id": 1,
          "ownerId": 1,
          "address": "123 Disney Lane",
          "city": "San Francisco",
          "state": "California",
          "country": "United States of America",
          "lat": 37.7645358,
          "lng": -122.4730327,
          "name": "App Academy",
          "description": "Place where web developers are created",
          "price": 123,
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "avgRating": 4.5,
          "previewImage": "image url"
        }
      ]
*/

const SpotEdit = () => {
  const { id } = useParams();
  const spot = useSelector(state => state.spots[id]);

  return (
    <SpotForm spot={spot} formType="Update your Spot" />
  );
}

export default SpotEdit ;
