import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ReservationForm from "./reservationComponents/ReservationForm"
import ErrorAlert from "../ErrorAlert";
import { createReservations } from "../../utils/api";
import { validateReservationDateTime } from "../../utils/date-time";


function CreateReservation() {
  const history = useHistory();

  const initialFormInfo = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };
  const [reservationInfo, setReservationInfo] = useState(initialFormInfo);
  const [errors, setErrors] = useState([]);


  const validateResDateTime = () => {
    const errorsArray = validateReservationDateTime(reservationInfo);
    if (errorsArray.length === 0) {
      return true;
    } else {
      setErrors(errorsArray);
      return false;
    }
  };

 
  const reservationErrorsList = () => {
    let temp = Date.now();
    return errors.map((error) => {
      temp = temp + 1;
      return <ErrorAlert key={temp} error={error} />;
    });
  };


  const handleCreateReservations = async (evt) => {
    evt.preventDefault();
    setErrors([]);
    try {
      const abortController = new AbortController();
      if (validateResDateTime()) {
        await createReservations(
          {
            ...reservationInfo,
            people: parseInt(reservationInfo.people),
          },
          abortController.signal
        );
        setReservationInfo(initialFormInfo);
        history.push(`/dashboard?date=${reservationInfo.reservation_date}`);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setErrors([...errors, error]);
      } else return;
    }
  };

  const onCancel = () => {
    setReservationInfo(initialFormInfo);
    if (history.length > 1) {
      history.goBack();
    } else history.push("/");
  };

  return (
    <main>
      <h1>Create Reservation</h1>
      {errors.length > 0 ? reservationErrorsList() : null}
      <ReservationForm
        onSubmit={handleCreateReservations}
        onCancel={onCancel}
        reservationInfo={reservationInfo}
        setReservationInfo={setReservationInfo}
        submitLabel="Submit"
        cancelLabel="Cancel"
      />
    </main>
  );
}

export default CreateReservation;