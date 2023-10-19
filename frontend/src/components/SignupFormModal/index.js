import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../store/session";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        thunkSignup({
          email,
          username,
          firstName,
          lastName,
          password,
      }))
      .then(res => {
        if (res.ok) {
          closeModal();
        }
        else {
          throw res
        }
      })
      .catch(data  => data && data.errors
        ? setErrors(data.errors)
        : closeModal())
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

    return (
      <>
      <form className="signupForm" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {errors && Object.values(errors).map((e,i) => (
        <p className="error" key={i}>{e}</p>))}
        <input className="signupInput"
          type="text"
          value={firstName}
          autoComplete="given-name"
          placeholder="First Name"
          autoFocus
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input className="signupInput"
          type="text"
          value={lastName}
          autoComplete="family-name"
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
        />
        <input className="signupInput"
          type="text"
          value={email}
          autoComplete="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input className="signupInput"
          type="text"
          value={username}
          autoComplete="username"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input className="signupInput"
          type="password"
          value={password}
          autoComplete="current-password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input className="signupInput"
          type="password"
          value={confirmPassword}
          autoComplete="current-password"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="signupSubmit" type="submit" disabled={!(email && username && firstName && lastName && password && confirmPassword && username.length >= 4 && password.length >= 6 /* && password.length === confirmPassword.length*/)} >Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;
