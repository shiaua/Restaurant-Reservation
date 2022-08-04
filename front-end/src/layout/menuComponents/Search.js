import React, { useState } from "react";
import SearchForm from "./SearchForm";
import ReservationList from "./reservationComponents/ReservationList";
import { listReservations, cancelReservation } from "../../utils/api";

function Search() {
  const [mobileNumber, setMobileNumber] = useState({ mobile_number: "" });
  const [reservations, setReservations] = useState([]);
  const [errors, setErrors] = useState(null);

  const formattedMobileNumber = mobileNumber.mobile_number.replace(/\D/g, "");

  const handleCancelClick = async (evt) => {
    evt.preventDefault();
    setMobileNumber({ mobile_number: "" });
    setReservations([]);
    setErrors(null);
    try {
      if (
        window.confirm(
          "Do you want to cancel this reservation? This cannot be undone."
        )
      ) {
        const abortController = new AbortController();
        const reservation_id = evt.target.getAttribute(
          "data-reservation-id-cancel"
        );
        await cancelReservation(
          { status: "cancelled" },
          reservation_id,
          abortController.signal
        );

        const response = await listReservations(
          {
            mobile_number: formattedMobileNumber,
          },
          abortController.signal
        );

        if (response.length > 0) {
          setReservations(response);
        } else throw Error("No reservations found.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setErrors(error);
      } else return;
    }
  };

  const findHandler = async (evt) => {
    evt.preventDefault();
    setReservations([]);
    setErrors(null);
    try {
      const abortController = new AbortController();
      const response = await listReservations(
        {
          mobile_number: formattedMobileNumber,
        },
        abortController.signal
      );

      if (response.length > 0) {
        setReservations(response);
      } else throw Error("No reservations found.");
    } catch (error) {
      if (error.name !== "AbortError") {
        setErrors(error);
      } else return;
    }
  };

  return (
    <main>
      <h1>Search Reservations</h1>
      <SearchForm
        mobileNumber={mobileNumber}
        setMobileNumber={setMobileNumber}
        onSubmit={findHandler}
        submitLabel="Find"
      />
      {reservations.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">NAME</th>
                <th scope="col">PHONE</th>
                <th scope="col">DATE</th>
                <th scope="col">TIME</th>
                <th scope="col">PEOPLE</th>
                <th scope="col">STATUS</th>
              </tr>
            </thead>
            <tbody>
              <ReservationList
                reservations={reservations}
                handleCancelClick={handleCancelClick}
                renderStatus="all"
              />
            </tbody>
          </table>
        </div>
      ) : null}

      {errors ? (
        <div className="table-responsive">
          <table className="table table-striped table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">NAME</th>
                <th scope="col">PHONE</th>
                <th scope="col">DATE</th>
                <th scope="col">TIME</th>
                <th scope="col">PEOPLE</th>
                <th scope="col">STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7}>{"No reservations found."}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}
    </main>
  );
}

export default Search;