// frontend/src/components/SpotForm/index.js
import { useRef, useState } from 'react';
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
    const attemptedSubmission = useRef(false);
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [supportUrl1, setSupportUrl1] = useState('');
    const [supportUrl2, setSupportUrl2] = useState('');
    const [supportUrl3, setSupportUrl3] = useState('');
    const [supportUrl4, setSupportUrl4] = useState('');
    const [errors, setErrors] = useState({});
    let ownerId;

    if (!sessionUser) return null
    else ownerId = sessionUser.id;

    if (spot) {
      setAddress(spot.address);
      setCity(spot.city);
      setState(spot.state);
      setCountry(spot.country);
      setName(spot.name);
      setDescription(spot.description);
      setPrice(spot.price);
      setPreviewUrl(spot.previewImage);
    } else spot = {};

    const handleSubmit = e => {
      e.preventDefault();
      attemptedSubmission.current = true;
      const validations = {};
      spot = { ...spot, ownerId, address, city, state, country, name,
        description, price };
      if (!address) validations.address = "Address is required"
      if (!city) validations.city = "City is required"
      if (!state) validations.state = "State is required"
      if (!country) validations.country = "Country is required"
      if (!name) validations.country = "Name is required"
      if (!description || description.length < 30)
        validations.description = "Description must have at least 30 characters"
      if (!price || price < 0) validations.price = "Price per night is required"
      if (!previewUrl) validations.previewUrl = "Preview image URL is required"
      setErrors(validations);
      if (Object.keys(validations).length === 0) {
          const thunkFunc = (formType === "Update your Spot")
            ? thunkUPDATESpot : thunkCREATESpot;
          const urls = [previewUrl];
          if (supportUrl1) urls.push(supportUrl1)
          if (supportUrl2) urls.push(supportUrl2)
          if (supportUrl3) urls.push(supportUrl3)
          if (supportUrl4) urls.push(supportUrl4)
          dispatch(thunkFunc(spot, {urls}))
          attemptedSubmission.current = false;
          history.push(`/spots/${spot.id}`);
        }
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
    <section className="createSpotSection1">
    <h2>Where's your place located?</h2>
    <p>Guests will only get your exact location once they book a reservation.</p>
      <label className="spotLabel">Country
      <input className="spotInput"
        type="text"
        placeholder='Country'
        value={country}
        autoComplete='country-name'
        onChange={e => setCountry(e.target.value)}
        required
        />
        </label>
        {attemptedSubmission && errors.country && <p className="error">{errors.country}</p>}
      <label className="spotLabel">Street Address
      <input className="spotInput"
        type="text"
        value={address}
        autoComplete='street-address'
        placeholder='Address'
        onChange={e => setAddress(e.target.value)}
        required
        />
      </label>
      {attemptedSubmission && errors.address && <p className="error">{errors.address}</p>}
      <div className="cityStateDiv">
      <label className="spotLabel">City
      <input className="spotInput"
        type="text"
        value={city}
        placeholder='City'
        autoComplete='address-level2'
        onChange={e => setCity(e.target.value)}
        required
        />
        </label><span>, </span>
        {attemptedSubmission && errors.city && <p className="error">{errors.city}</p>}
      <label className="spotLabel">State
      <input className="spotInput"
        type="text"
        value={state}
        autoComplete='address-level1'
        placeholder='State'
        onChange={e => setState(e.target.value)}
        required
        />
        </label>
        {attemptedSubmission && errors.state && <p className="error">{errors.state}</p>}
      </div>
    <hr></hr>
    </section>
    <section className="createSpotSection2">
      <h2>Describe your place to guests</h2>
      <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
      <textarea
        value={description}
        placeholder='Please write at least 30 characters'
        autoComplete='off'
        onChange={e => setDescription(e.target.value)}
        required
        spellCheck={true}
        rows={6}
      />
      {attemptedSubmission && errors.description && <p className="error">{errors.description}</p>}
    <hr></hr>
    </section>
    <section className="createSpotSection3">
      <h2>Create a title for your spot</h2>
      <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
      <input
        type="text"
        value={name}
        autoComplete='off'
        placeholder="Name of your spot"
        onChange={e => setName(e.target.value)}
        />
      {attemptedSubmission && errors.name && <p className="error">{errors.name}</p>}
    <hr></hr>
    </section>
    <section className="createSpotSection4">
    <h2>Set a base price for your spot</h2>
    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
    <div className="priceSpotFormDiv"><span>$ </span>
    <input
      type="number"
      value={price}
      autoComplete='transaction-amount'
      placeholder='Price per night (USD)'
      onChange={e => setPrice(e.target.value)}
      />
    </div>
    {attemptedSubmission && errors.price && <p className="error">{errors.price}</p>}
    <hr></hr>
    </section>
    <section className="createSpotSection5">
    <h2>Liven up your spot with photos</h2>
    <p>Submit a link to at least one photo to publish your spot.</p>
    <input type="text" value={previewUrl} autoComplete="photo" placeholder="Preview Image URL" onChange={e => setPreviewUrl(e.target.value)} />
    {attemptedSubmission && errors.previewUrl && <p className="error">{errors.previewUrl}</p>}
    <fieldset disabled={previewUrl === ''}>
    <input type="text" value={supportUrl1} onChange={e=>setSupportUrl1(e.target.value)} autoComplete="photo" placeholder="Image URL" />
    <input type="text" value={supportUrl2} onChange={e=>setSupportUrl2(e.target.value)} autoComplete="photo" placeholder="Image URL" />
    <input type="text" value={supportUrl3} onChange={e=>setSupportUrl3(e.target.value)} autoComplete="photo" placeholder="Image URL" />
    <input type="text" value={supportUrl4} onChange={e=>setSupportUrl4(e.target.value)} autoComplete="photo" placeholder="Image URL" />
    </fieldset>
    <hr></hr>
    </section>
    <button type="submit">{formType === "Update your Spot" ? formType : "Create Spot"}</button>
  </form>
  );
}

export default SpotForm ;
