// frontend/src/index.js
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { ModalProvider, Modal } from "./context/Modal";
import App from "./App";
import "./index.css";

import configureStore from "./store";
import { restoreCSRF, csrfFetch } from "./store/csrf";
import * as sessionActions from "./store/session";
import ErrorBoundary from "./components/ErrorBoundary";

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

// Wrap the application with the Modal provider and render
// the Modal component after the App component so that all
// the Modal content will be layered as HTML elements on
// top of all the other HTML elements:
function Root() {
  return (
    <ErrorBoundary fallback="Error...">
      <ModalProvider>
        <Provider store={store}>
          <BrowserRouter>
            <App />
            <Modal />
          </BrowserRouter>
        </Provider>
      </ModalProvider>
    </ErrorBoundary>
  );
}


const v18 = false;
if (v18) { /* unfortunately, using the official v18 createRoot seems to break
              the provided modals, so for now using older approach */

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <StrictMode>
    <Root />
  </StrictMode>
);

} else { // v17

  ReactDOM.render(
    <StrictMode>
      <Root />
    </StrictMode>,
    document.getElementById("root")
  );

} // end if (v18)
