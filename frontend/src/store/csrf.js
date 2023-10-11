// frontend/src/store/csrf.js
import Cookies from 'js-cookie';
export const jsonHeaderContent = {"Content-Type":"application/json"}

export async function csrfFetch(url, options = {}) {
  /* set progress cursor */
  const bodyClasses = document.body.classList;
  bodyClasses.add("waiting");

  // set options.method to 'GET' if there is no method
  options.method = options.method || 'GET';
  // set options.headers to an empty object if there is no headers
  options.headers = options.headers || jsonHeaderContent;

  // if the options.method is not 'GET', then set the "Content-Type" header to
    // "application/json", and set the "XSRF-TOKEN" header to the value of the
    // "XSRF-TOKEN" cookie
  if (options.method.toUpperCase() !== 'GET') {
    options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
  }
  // call the default window's fetch with the url and the options passed in
  let res;
    try {
      res = await window.fetch(url, options);
    } catch (error) {
      error.status = error.status || 500;
      if (error.errors) error.errors.fetch = "Failed to Fetch"
      else error.errors = {"fetch": "Failed to Fetch"}
      res = error;
    }

  // if the response status code is 400 or above, then throw an error with the
    // error being the response

  bodyClasses.remove("waiting");
  // if (res.status >= 400) throw res;

  // if the response status code is under 400, then return the response to the
    // next promise chain
  return res;
}

// call this to get the "XSRF-TOKEN" cookie, should only be used in development
export function restoreCSRF() {
    return csrfFetch('/api/csrf/restore');
}

export const fetchData = (url, options) => {
  /* Returns Promise which resolves to either data or errors */
  return csrfFetch(url, options)
    .then(response => response.ok
        ? response.json()
        : response.json().then(err => err)) /* get detailed error info  */
    .catch(systemicError => ({"errors": {"system": systemicError.message}}))
}
