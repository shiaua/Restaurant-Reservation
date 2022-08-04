import React from "react";



function ReservationForm({
  onSubmit,
  onCancel,
  reservationInfo,
  setReservationInfo,
  submitLabel,
  cancelLabel,
}) {
  const handleInputChange = (event) => {
    setReservationInfo({
      ...reservationInfo,
      [event.target.name]: event.target.value,
    });
  };
  return (
    <form onSubmit={onSubmit}>
      <fieldset>
        <div className="row">
          <div className="form-group col">
            <label htmlFor="first_name">First Name</label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={reservationInfo["first_name"]}
              onChange={handleInputChange}
              required
              className="form-control"
              placeholder="First Name"
            ></input>
          </div>
          <div className="form-group col">
            <label htmlFor="last_name">Last Name</label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={reservationInfo["last_name"]}
              onChange={handleInputChange}
              required
              className="form-control"
              placeholder="Last Name"
            ></input>
          </div>
          <div className="form-group col">
            <label htmlFor="mobile_number">Mobile Number</label>
            <input
              id="mobile_number"
              name="mobile_number"
              type="tel"
              value={reservationInfo["mobile_number"]}
              onChange={handleInputChange}
              required
              className="form-control"
              placeholder="Mobile Number"
            ></input>
          </div>
        </div>
        <div className="row">
          <div className="form-group col">
            <label htmlFor="reservation_date">Date</label>
            <input
              id="reservation_date"
              name="reservation_date"
              type="date"
              value={reservationInfo["reservation_date"]}
              onChange={handleInputChange}
              required
              className="form-control"
              pattern="\d{4}-\d{2}-\d{2}"
              max=""
            ></input>
          </div>
          <div className="form-group col">
            <label htmlFor="reservation_time">Time</label>
            <input
              id="reservation_time"
              name="reservation_time"
              type="time"
              value={reservationInfo["reservation_time"]}
              onChange={handleInputChange}
              required
              className="form-control"
            ></input>
          </div>
          <div className="form-group col">
            <label htmlFor="people">People</label>
            <input
              id="people"
              name="people"
              type="number"
              value={reservationInfo["people"]}
              onChange={handleInputChange}
              required
              className="form-control"
              aria-label="Number of People"
            ></input>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-secondary mr-2"
          onClick={onCancel}
        >
          <span className="oi oi-x"></span>
          &nbsp;{cancelLabel}
        </button>
        <button type="submit" className="btn btn-primary">
          <span className="oi oi-check"></span>
          &nbsp;{submitLabel}
        </button>
      </fieldset>
    </form>
  );
}

export default ReservationForm;