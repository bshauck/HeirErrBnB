// frontend/src/components/SpotEdit/index.js
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SpotForm from '../SpotForm';

const SpotEdit = () => {
  const { id } = useParams();
  const spot = useSelector(state => state.spots?.userSpots[id]);

  return (
    <SpotForm spot={spot} formType="Update your Spot" />
  );
}

export default SpotEdit ;
