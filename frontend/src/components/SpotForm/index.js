// frontend/src/components/SpotForm/index.js
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { thunkCREATESpot, thunkUPDATESpot } from "../../store/spots"
import './SpotForm.css';

/* TODO
eventually set lat lng via GoogleMaps api
*/

function SpotForm ({spot, formType}) {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const history = useHistory();
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [errors, setErrors] = useState({});
    let ownerId;

    if (!sessionUser) return null
    else ownerId = sessionUser.id;

    const handleSubmit = e => {
      const validations = {...errors}; /* to stop saying it's unused ftm */
      e.preventDefault();
      spot = { ...spot, ownerId, address, city, state, country, name,
        description, price };
      const thunkFunc = (formType === "Update your Spot")
        ? thunkUPDATESpot : thunkCREATESpot;
      dispatch(thunkFunc(spot))
      setErrors(validations);
      history.push(`/spots/${spot.id}`);
    };

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

  return ( /* todo setup form */
  <form onSubmit={handleSubmit} >
    <h1>{formType}</h1>
    <section>
    <h2>Where's your place located?</h2>
    <p>Guests will only get your exact location once they booked a reservation.</p>
      <label>Country
      <input
        type="text"
        placeholder='Country'
        value={country}
        autoComplete='country-name'
        onChange={e => setCountry(e.target.value)}
        />
        </label>
      <label>Street Address
      <input
        type="text"
        value={address}
        autoComplete='street-address'
        placeholder='Address'
        onChange={e => setAddress(e.target.value)}
        />
      </label>
      <div className="cityStateDiv">
      <label>City
      <input
        type="text"
        value={city}
        placeholder='City'
        autoComplete='address-level2'
        onChange={e => setCity(e.target.value)}
        />
        </label>
      <label>State
      <input
        type="text"
        value={state}
        autoComplete='address-level1'
        placeholder='STATE'
        onChange={e => setState(e.target.value)}
        />
        </label>
      </div>
    </section>
    <hr></hr>
    <section>
      <h2>Describe your place to guests</h2>
      <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
      <textarea
        value={description}
        placeholder='Please write at least 30 characters'
        autoComplete='off'
        onChange={e => setDescription(e.target.value)}
      />
    </section>
    <hr></hr>
    <section>
      <h2>Create a title for your spot</h2>
      <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
      <input
        type="text"
        value={name}
        autoComplete='off'
        onChange={e => setName(e.target.value)}
        />
    </section>
    <hr></hr>
    <section>
    <h2>Set a base price for your spot</h2>
    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
    <input
        type="number"
        value={price}
        autoComplete='transaction-amount'
        onChange={e => setPrice(e.target.value)}
        />
    <hr></hr>
    </section>
    <section>
    <h2>Liven up your spot with photos</h2>
    <p>Submit a link to at least one photo to publish your spot.</p>
    <input type="text" value={previewImage} autoComplete="photo" placeholder="Preview Image URL" onChange={e => setPreviewImage(e.target.value)} />
    <input type="text" value=""  autoComplete="photo" placeholder="Image URL" disabled={previewImage === ''} />
    <input type="text" value=""  autoComplete="photo" placeholder="Image URL" disabled={previewImage === ''} />
    <input type="text" value=""  autoComplete="photo" placeholder="Image URL" disabled={previewImage === ''} />
    <input type="text" value=""  autoComplete="photo" placeholder="Image URL" disabled={previewImage === ''} />
    <hr></hr>
    </section>
    <button value={formType === "Update your Spot" ? formType : "Create Spot"}></button>
  </form>
  );
}

export default SpotForm ;
