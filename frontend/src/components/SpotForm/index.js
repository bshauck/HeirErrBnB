// frontend/src/components/SpotForm/index.js
import { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkCREATESpot, thunkUPDATESpot } from "../../store/spots"
import './SpotForm.css';
import { getFullImages } from '../../utils/imageUrl';

/* TODO
eventually set lat lng via GoogleMaps api
*/

function SpotForm ({spot, formType}) {
    const sessionUser = useSelector(state => state.session.user);
    console.log("🚀 ~ file: index.js:14 ~ SpotForm ~ sessionUser:", sessionUser)
    const dispatch = useDispatch();
    const history = useHistory();
    const attemptedSubmission = useRef(false);
    const [address, setAddress] = useState(spot?.address || '');
    const [city, setCity] = useState(spot?.city || '');
    const [state, setState] = useState(spot?.state || '');
    const [country, setCountry] = useState(spot?.country || '');
    const [name, setName] = useState(spot?.name || '');
    const [description, setDescription] = useState(spot?.description || '');
    const [price, setPrice] = useState(spot?.price || '');
    const [previewUrl, setPreviewUrl] = useState(spot?.previewUrl || '');
    const [supportUrl1, setSupportUrl1] = useState('');
    const [supportUrl2, setSupportUrl2] = useState('');
    const [supportUrl3, setSupportUrl3] = useState('');
    const [supportUrl4, setSupportUrl4] = useState('');
    const [errors, setErrors] = useState({});
    const isEdit = formType === "Update your Spot";
    let ownerId;
    let title = useRef('abc')

    if (!sessionUser) return null
    else ownerId = sessionUser.id;

    if (!spot && !isEdit) spot = {};

    const handleSubmit = async e => {
      e.preventDefault();
      attemptedSubmission.current = true;
      const validations = {};
      spot = { ...spot, ownerId, address, city, state, country, name,
        description, price };
      const extensionError = "Image URLs must end in png, jpg, or jpeg"
      if (!address) validations.address = "Address is required"
      if (!city) validations.city = "City is required"
      if (!state) validations.state = "State is required"
      if (!country) validations.country = "Country is required"
      if (!name) validations.name = "Name is required"
      if (!description || description.length < 30)
        validations.description = "Description must have at least 30 characters"
      if (!price || price < 0) validations.price = "Price per night is required"
      /* TODO For now; skip images on Update */
      if (!isEdit) {
      if (!previewUrl) validations.previewUrl = "Preview image URL is required"
      else if (!validImageUrl(previewUrl)) validations.previewUrl = extensionError
      if (supportUrl1 && !validImageUrl(supportUrl1)) validations.supportUrl1 = extensionError
      if (supportUrl1 && !validImageUrl(supportUrl2)) validations.supportUrl2 = extensionError
      if (supportUrl1 && !validImageUrl(supportUrl3)) validations.supportUrl3 = extensionError
      if (supportUrl1 && !validImageUrl(supportUrl4)) validations.supportUrl4 = extensionError
      }
      setErrors(validations);
      if (Object.keys(validations).length === 0) {
          const thunkFunc = isEdit ? thunkUPDATESpot : thunkCREATESpot;
          if (!isEdit) {
          const urls = [previewUrl];
          if (supportUrl1) urls.push(supportUrl1)
          if (supportUrl2) urls.push(supportUrl2)
          if (supportUrl3) urls.push(supportUrl3)
          if (supportUrl4) urls.push(supportUrl4)
          spot = await dispatch(thunkFunc(spot, {urls}))
          } else await dispatch(thunkFunc(spot));

          attemptedSubmission.current = false;
          history.push(`/spots/${spot.id}`);
        }
    };

    function validImageUrl(str) {
      if (str && (str = str.trim()).length > 5) {
        str = str.toLowerCase();
        return (str.endsWith(".png") || str.endsWith(".jpg") || str.endsWith(".jpeg"))
      }
      return false;
    }

    // const isDevelopment = process.env.NODE_ENV !== 'production';

    function defaultFillSpot() { /* TODO to be removed before final */
      /* takes too long to fill out a form each time so in dev have a button */
      const urls = getFullImages();
      setPreviewUrl(urls[0]);
      setAddress('432 Main St');
      setCity('Denver');
      setState('Colorado');
      setCountry('United States');
      setName(title.current);
      title.current=title.current+"a"
      setDescription('This is exactly 30 characters.');
      setPrice('543');
      setSupportUrl1(urls[1])
      setSupportUrl2(urls[2])
      setSupportUrl3(urls[3])
      setSupportUrl4(urls[4])
    }

  return (
  <div className='spotFormDiv'>
  <form className="spotForm" onSubmit={handleSubmit} >
    <div className="innerSpotFormDiv">
    <h1>{formType}</h1> <button type="button" onClick={defaultFillSpot}>DEFAULT</button>
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
    <div className="priceSpotFormDiv"><span>$
    <input className="spotFormPriceInput"
      type="number"
      value={price}
      autoComplete='transaction-amount'
      placeholder='Price per night (USD)'
      onChange={e => setPrice(e.target.value)}
      /></span>
    </div>
    {attemptedSubmission && errors.price && <p className="error">{errors.price}</p>}
    <hr></hr>
    </section>
    {isEdit !== true &&
    <section className="createSpotSection5">
    <h2>Liven up your spot with photos</h2>
    <p>Submit a link to at least one photo to publish your spot.</p>
    <input type="text" value={previewUrl} autoComplete="photo" placeholder="Preview Image URL" onChange={e => setPreviewUrl(e.target.value)} />
    <p> </p><p className="error">{attemptedSubmission && errors.previewUrl && errors.previewUrl}</p>
    <input type="text" value={supportUrl1} onChange={e=>setSupportUrl1(e.target.value)} autoComplete="photo" placeholder="Image URL" disabled={previewUrl === ''} />
    <p className="error">{attemptedSubmission && errors.supportUrl1 && errors.supportUrl1}</p>
    <input type="text" value={supportUrl2} onChange={e=>setSupportUrl2(e.target.value)} autoComplete="photo" placeholder="Image URL" disabled={previewUrl === ''} />
    <p className="error">{attemptedSubmission && errors.supportUrl2 && errors.supportUrl2}</p>
    <input type="text" value={supportUrl3} onChange={e=>setSupportUrl3(e.target.value)} autoComplete="photo" placeholder="Image URL" disabled={previewUrl === ''} />
    <p className="error">{attemptedSubmission && errors.supportUrl3 && errors.supportUrl3}</p>
    <input type="text" value={supportUrl4} onChange={e=>setSupportUrl4(e.target.value)} autoComplete="photo" placeholder="Image URL" disabled={previewUrl === ''}/>
    <p className="error">{attemptedSubmission && errors.supportUrl4 && errors.supportUrl4}</p>
    <hr></hr>
    </section>}
    <button className="spotFormSubmitButton" type="submit">{isEdit ? formType : "Create Spot"}</button>
    </div>
  </form>
  </div>
  );
}

export default SpotForm ;
