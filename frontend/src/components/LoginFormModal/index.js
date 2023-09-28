// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import * as sessionActions from "../../store/session";
import { useModal } from "../../context/Modal";

function LoginFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  function demoUserActivated(e) {
    setCredential("demo@user.io");
    setPassword("password");
    handleSubmit(e);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        } else history.push("/")
      });
  };

  return (
    <>
      <form className="loginForm" onSubmit={handleSubmit}>
        <div className="loginDiv">
          <h2 className="loginTitle">Log In</h2>
          <input
            className="loginCredentialInput"
            type="text"
            value={credential}
            placeholder="Username or Email"
            autoComplete="username"
            onChange={(e) => setCredential(e.target.value)}
            required
          />
          <input
            className="loginPasswordInput"
            type="password"
            value={password}
            placeholder="Password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        {errors.credential && (
          <p className="error">{errors.credential}</p>
        )}
        <button disabled={credential.length < 4 || password.length < 6} className="loginButton" type="submit">Log In</button>
        <button className="demoUserButton" type="button" onClick={(e) => demoUserActivated(e)}>Demo User</button>
        </div>
      </form>
    </>
  );
}

export default LoginFormModal;
