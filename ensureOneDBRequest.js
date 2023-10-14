/*
In a component that needs details that will be fetched
only for this component, a way to avoid additional
fetch requests is to know a previous request has been
made by keeping track of it.

useEffect will happen on every component re-mount but not
until almost the 2nd render; however, our store state
doesn't go away just because a component remounts.
*/

  // 11 lines avoiding 2nd reqs can be narrowed to 9
  // if dispatch(thunk) returns truthy values
  const ref = useRef({});
  if (thing.id) { // have top level, check for inner need
    if (!thing.inner) { // missing inner details
      if (!ref.current[thing.id]) { // first request
        ref.current[thing.id] = true;
        dispatch(thunkGetThingDetails(thing.id))
      }
      return null; // no details yet; but need them
    } else if (ref.current[thing.id]) // fulfilled; remove
      delete ref.current[thing.id]
  }
