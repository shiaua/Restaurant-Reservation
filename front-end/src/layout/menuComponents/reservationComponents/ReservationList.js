import React from "react";
import { Link } from "react-router-dom";

function ReservationList({ reservations, handleCancelClick, renderStatus }) {
  const reservationList =
    reservations.length > 0 ? (
      reservations.map(
        ({
          reservation_id,
          first_name,
          last_name,
          mobile_number,
          reservation_date,
          reservation_time,
          people,
          status,
        }) => {
          if (
            status === "seated" ||
            (status === "finished" && renderStatus === "all") ||
            (status === "cancelled" && renderStatus === "all")
          ) {
            return (
              <tr key={reservation_id}>
                <th scope={reservation_id}>{reservation_id}</th>
                <td>
                  {last_name}, {first_name}
                </td>
                <td>{mobile_number}</td>
                <td>{reservation_date}</td>
                <td>{reservation_time}</td>
                <td>{people}</td>
                <td data-reservation-id-status={reservation_id}>{status}</td>
              </tr>
            );
          } else if (status === "booked") {
            return (
              <tr key={reservation_id}>
                <th scope={reservation_id}>{reservation_id}</th>
                <td>
                  {last_name}, {first_name}
                </td>
                <td>{mobile_number}</td>
                <td>{reservation_date}</td>
                <td>{reservation_time}</td>
                <td>{people}</td>
                <td data-reservation-id-status={reservation_id}>{status}</td>
                <td>
                  <Link
                    className="btn btn-secondary"
                    to={`reservations/${reservation_id}/seat`}
                  >
                    Seat
                  </Link>
                </td>
                <td>
                  <Link
                    className="btn btn-secondary"
                    to={`reservations/${reservation_id}/edit`}
                  >
                    Edit
                  </Link>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-reservation-id-cancel={reservation_id}
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            );
          } else return null;
        }
      )
    ) : (
      <tr>
        <td colSpan={6}>No reservations found.</td>
      </tr>
    );

  return reservationList;
}

export default ReservationList;