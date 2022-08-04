import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReservationList from "./reservationComponents/ReservationList";
import ErrorAlert from "../ErrorAlert";
import {
  listReservations,
  listTables,
  clearFinishedTable,
  cancelReservation,
} from "../../utils/api";
import { today, previous, next } from "../../utils/date-time";
import useQuery from "../../utils/useQuery";



function Dashboard() {
  const [date, setDate] = useState(today());
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservations([]);
    setReservationsError(null);
    setTables([]);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal).then(setTables);
    return () => abortController.abort();
  }


  const query = useQuery();
  let queryDate = query.get("date");
  useEffect(dateChange, [queryDate]);

  function dateChange() {
    if (queryDate) {
      setDate(queryDate);
    } else setDate(today());
  }

  const handleClearTable = async (evt) => {
    try {
      if (
        window.confirm(
          "Is this table ready to seat new guests? This cannot be undone."
        )
      ) {
        const abortController = new AbortController();
        const tableId = evt.target.getAttribute("data-table-id-finish");
        await clearFinishedTable(tableId, abortController.signal);
        loadDashboard();
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setReservationsError(error);
      } else return;
    }
  };

  const tableList = tables.map(
    ({ table_id, table_name, capacity, reservation_id }) => {
      return (
        <tr key={table_id}>
          <td>{table_id}</td>
          <td>{table_name}</td>
          <td>{capacity}</td>
          <td data-table-id-status={table_id}>
            {reservation_id === null ? "Free" : "Occupied"}
          </td>
          {reservation_id ? (
            <td>
              <button
                type="button"
                data-table-id-finish={table_id}
                className="btn btn-light"
                onClick={handleClearTable}
              >
                Finish
              </button>
            </td>
          ) : null}
        </tr>
      );
    }
  );

  const handleCancelClick = async (evt) => {
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
        loadDashboard();
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setReservationsError(error);
      } else return;
    }
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="row">
        <div className="col-md-6 col-lg-6 col-sm-12">
          <div className="d-md-flex mb-3">
            <h4 className="mb-0">Reservations for {date}</h4>
          </div>
          <div className="btn-group">
            <Link
              className="btn btn-secondary"
              to={`/dashboard?date=${previous(date)}`}
            >
              <span className="oi oi-chevron-left"></span>
              &nbsp;Previous
            </Link>
            <Link
              className="btn btn-secondary"
              to={`/dashboard?date=${today()}`}
            >
              Today
            </Link>
            <Link
              className="btn btn-secondary"
              to={`/dashboard?date=${next(date)}`}
            >
              Next&nbsp;<span className="oi oi-chevron-right"></span>
            </Link>
          </div>
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
                  renderStatus="strict"
                />
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-6 col-lg-6 col-sm-12">
          <div className="table-responsive">
            <table className="table table-striped table-dark">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">TABLE NAME</th>
                  <th scope="col">CAPACITY</th>
                  <th scope="col">Free?</th>
                </tr>
              </thead>
              <tbody>{tableList}</tbody>
            </table>
          </div>
        </div>
      </div>

      <ErrorAlert error={reservationsError} />
      
    </main>
  );
}

export default Dashboard;