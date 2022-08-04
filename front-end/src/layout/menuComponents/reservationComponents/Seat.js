import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import SeatForm from "./SeatForm";
import ErrorAlert from "../../ErrorAlert";
import { listTables, readReservation, updateTable } from "../../../utils/api";


function Seat() {
  const history = useHistory();
  const { resId } = useParams();

  const [reservationById, setReservationById] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [error, setError] = useState(null);

  useEffect(loadSeatPage, [resId]);
  function loadSeatPage() {
    setReservationById(null);
    setTables([]);
    setError(null);
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables).catch(setError);
    readReservation(resId, abortController.signal)
      .then(setReservationById)
      .catch(setError);

    return () => abortController.abort();
  }

  
  const tableOptions = tables.map((table) => (
    <option key={table.table_id} value={table.table_id}>
      {table.table_name} - {table.capacity}
    </option>
  ));


  const renderReservation = reservationById ? (
    <h3>
      # {reservationById.reservation_id} - {reservationById.first_name}{" "}
      {reservationById.last_name} on {reservationById.reservation_date} at{" "}
      {reservationById.reservation_time} for {reservationById.people}
    </h3>
  ) : null;

  const handleTableSubmission = async (evt) => {
    evt.preventDefault();
    setReservationById(null);
    setSelectedTable(null);
    setError(null);
    if (reservationById.people > selectedTable.capacity) {
      setError({
        message: `Table does not have enough capacity. Seating for ${reservationById.people} is needed.`,
      });
      return;
    }
    try {
      const abortController = new AbortController();
      await updateTable(
        selectedTable.table_id,
        {
          reservation_id: reservationById.reservation_id,
        },
        abortController.signal
      );
      history.push(`/dashboard?date=${reservationById.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      } else return;
    }
  };

  const onCancel = () => {
    if (history.length > 1) {
      history.goBack();
    } else history.push("/");
  };

  return (
    <main>
      <h1>Seat Reservation</h1>
      {error ? (
        <ErrorAlert key={Date.now()} error={error} />
      ) : (
        renderReservation
      )}
      <SeatForm
        onSubmit={handleTableSubmission}
        onCancel={onCancel}
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        submitLabel="Submit"
        cancelLabel="Cancel"
        tableOptions={tableOptions}
        tables={tables}
      />
    </main>
  );
}

export default Seat;