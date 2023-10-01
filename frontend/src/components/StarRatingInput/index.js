import { useEffect, useState } from "react";

const StarRatingInput = ({ rating, disabled, onChange }) => {
  const [stars, setStars] = useState(rating);

  function starColor(n) {
    return n <= stars ? "filled" : "empty"
  }

  function handleMouseEnter(n) {
    setStars(n)
  }
  function handleMouseLeave() {
    setStars(rating)
  }

  useEffect(() => {
    setStars(rating);
  }, [rating]);

  function itemPojo(n) {
    const result = {ordinal: n, className: "fa fa-star"};
    if (!disabled) {
      result["onMouseEnter"] = true;
      result["onMouseLeave"] = true
    }
    return result
  }

  function createStarIcon(ordinal, {className, onMouseEnter, onMouseLeave}) {
    return (
      <div className={starColor(ordinal)} onClick={()=>onChange(ordinal)} >
        <i className={className + (onMouseEnter ? ` onMouseEnter={()=>handleMouseEnter${ordinal}}`:'') + (onMouseLeave ?
 ` onMouseEnter={()=>handleMouseLeave${ordinal}}`:'')}></i>
      </div>
    )
  }

  return (
    <div className="stars-input">
      {[1,2,3,4,5].map(n => (
        createStarIcon(itemPojo(n))
      ))}
    </div>
  );
};

export default StarRatingInput;
