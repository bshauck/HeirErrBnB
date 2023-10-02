import { useEffect, useState } from 'react';

const StarRatingInput = ({ rating, disabled, onChange }) => {
  const [stars, setStars] = useState(rating);

  useEffect(() => {
    setStars(rating);
  }, [rating]);
  // NOTE: This useEffect isn't necessary to have for
  // this scenario, but if you have a scenario which
  // requires this input to be re-rendered with an updated
  // rating prop instead of unmounted and remounted with
  // an updated rating, then this useEffect is necessary.

  const starIcon = (number) => {
    const props = {};
    if (!disabled) {
      props.onMouseEnter = () => setStars(number);
      props.onMouseLeave = () => setStars(rating);
      props.onClick = () => onChange(number);
    }
    return (
      <span key={number} className="starIconSpans" {...props}>
        <i className={stars >= number ? "filled fas fa-star" : "empty fa fa-star"}></i>
      </span>
    );
  };

  return (
    <div className="rating-input">
      {[1, 2, 3, 4, 5].map(number => starIcon(number))}
    </div>
  );
};

export default StarRatingInput;
