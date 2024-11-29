const Signup = ()=>{
  return (
    <form>
      <h1>Sign up</h1>
      <div className="form-group">
        <label>Email address</label>
        <input className="form-control"/>
      </div>
      <div className="form-group">
        <label>password</label>
        <input type="password" className="form-control"/>
      </div>
      <button className="btn btn-primary">Sign up</button>
    </form>
  )
}

export default Signup;