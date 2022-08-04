function SearchForm({ onSubmit, mobileNumber, setMobileNumber, submitLabel }) {
    const handleMobileNumberInput = (evt) => {
      setMobileNumber({
        [evt.target.name]: evt.target.value,
      });
    };
    return (
      <form onSubmit={onSubmit}>
        <fieldset>
          <div className="row">
            <div className="form-group col-md-4 col-sm-12">
              <label htmlFor="mobile_number">Mobile Number:</label>
              <div className="input-group">
                <input
                  id="mobile_number"
                  name="mobile_number"
                  type="text"
                  value={mobileNumber.mobile_number}
                  onChange={handleMobileNumberInput}
                  required
                  className="form-control"
                  placeholder="Enter a customer's phone number"
                ></input>
                <div className="input-group-append">
                  <button type="submit" className="btn btn-primary">
                    <span className="oi oi-magnifying-glass"></span>
                    &nbsp;{submitLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
  
  export default SearchForm;