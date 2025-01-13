const NewTicket = () => {
  return (
    <div>
      <h1>create a ticket</h1>
      <form>
        <div className="form-group">
          <label>Title</label>
          <input className="form-control"/>
        </div>
        <div className="form-group">
          <label>price</label>
          <input className="form-control"/>
        </div>
        
        <button className="btn btn-primary">submit</button>
      </form>
    </div>
  );
}

export default NewTicket;