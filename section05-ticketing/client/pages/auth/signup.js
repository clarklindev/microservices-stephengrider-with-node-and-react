import { useState } from 'react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    console.log(email, password);
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <h1>Sign up</h1>
        <div className="form-group">
          <label>Email address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
          />
        </div>
        <br/>
        <button className="btn btn-primary">Sign up</button>
      </form>
    </div>
  );
};

export default Signup;
