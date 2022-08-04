/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
 import formatReservationDate from "./format-reservation-date";
 import formatReservationTime from "./format-reservation-date";
 
 const API_BASE_URL =
   process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
 
 /**
  * Defines the default headers for these functions to work with `json-server`
  */
 const headers = new Headers();
 headers.append("Content-Type", "application/json");
 
 /**
  * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
  *
  * This function is NOT exported because it is not needed outside of this file.
  *
  * @param url
  *  the url for the requst.
  * @param options
  *  any options for fetch
  * @param onCancel
  *  value to return if fetch call is aborted. Default value is undefined.
  * @returns {Promise<Error|any>}
  *  a promise that resolves to the `json` data or an error.
  *  If the response is not in the 200 - 399 range the promise is rejected.
  */
 async function fetchJson(url, options, onCancel) {
   try {
     const response = await fetch(url, options);
     //this is where JS sends the url and the data 'inside the options' to the express server.
     if (response.status === 204) {
       return null;
     }
 
     const payload = await response.json();
 
     if (payload.error) {
       return Promise.reject({ message: payload.error });
     }
     return payload.data;
   } catch (error) {
     if (error.name !== "AbortError") {
       console.error(error.stack);
       throw error;
     }
     return Promise.resolve(onCancel);
   }
 }
 
 /**
  * Append the date as a key-value pair to the params.
  * i.e. dashboard?date=2022-07-18
  * Retrieves all existing reservation.
  * @returns {Promise<[reservation]>}
  *  a promise that resolves to a possibly empty array of reservation saved in the database.
  */
 export async function listReservations(params, signal) {
   const url = new URL(`${API_BASE_URL}/reservations`);
   Object.entries(params).forEach(([key, value]) =>
     url.searchParams.append(key, value.toString())
   );
   return await fetchJson(url, { headers, signal }, [])
     .then(formatReservationDate)
     .then(formatReservationTime);
 }
 
 /**
  * Retrieves an reservation by the param ID.
  * @param paramId
  * @returns {Promise<[reservation]>}
  *  a promise that resolves to a possibly empty object of reservation saved in the database.
  */
 export async function readReservation(resId, signal) {
   const url = new URL(`${API_BASE_URL}/reservations/${resId}`);
   return await fetchJson(url, { headers, signal }, [])
     .then(formatReservationDate)
     .then(formatReservationTime);
 }
 
 /**
  * Sends the reservation form to the express server after validating the form.
  * @param data
  *  The reservation form to save.
  * @param signal
  *  optional AbortController.signal
  * @returns {Promise<deck>}
  *  a promise that resolves the saved reservation, with an `id` property.
  */
 export async function createReservations(data, signal) {
   const url = new URL(`${API_BASE_URL}/reservations`);
   console.log(data)
   const options = {
     headers,
     signal,
     method: "POST",
     body: JSON.stringify({ data }),
   };
   return await fetchJson(url, options, data);
 }
 
 /**
  * Sends the reservation form to the express server after validating the form.
  * @param data
  *  The reservation form to save.
  * @param signal
  *  optional AbortController.signal
  * @returns {Promise<deck>}
  *  a promise that resolves an updated reservation.
  */
 export async function editReservation(data, signal) {
   const url = new URL(`${API_BASE_URL}/reservations/${data.reservation_id}`);
   const options = {
     headers,
     signal,
     method: "PUT",
     body: JSON.stringify({ data }),
   };
   return await fetchJson(url, options, data);
 }
 
 /**
  * Sends the reservation id to the server to cancel the order.
  * @param reservation_id
  *  The reservation id to be cancelled.
  * @param signal
  *  optional AbortController.signal
  * @returns {Promise<deck>}
  *  a promise that resolves a cancelled reservation.
  */
 export async function cancelReservation(data, reservation_id, signal) {
   const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}/status`);
   const options = {
     headers,
     signal,
     method: "PUT",
     body: JSON.stringify({ data }),
   };
   return await fetchJson(url, options, data);
 }
 
 /**
  * Retrieves all existing tables.
  * @returns {Promise<[table]>}
  *  a promise that resolves to a possibly empty array of table saved in the database.
  */
 export async function listTables(signal) {
   const url = new URL(`${API_BASE_URL}/tables`);
   return await fetchJson(url, { headers, signal }, []);
 }
 
 /**
  * Sends the table form to the express server after validating the form.
  * @param data
  *  The table form to save.
  * @param signal
  *  optional AbortController.signal
  * @returns {Promise<deck>}
  *  a promise that resolves the saved table, with an `id` property
  */
 export async function createTables(data, signal) {
   const url = new URL(`${API_BASE_URL}/tables`);
   const options = {
     headers,
     signal,
     method: "POST",
     body: JSON.stringify({ data }),
   };
   return await fetchJson(url, options, data);
 }
 
 /**
  * Sends the seat form to the express server after validating the form.
  * @param url
  *  Containing the table id
  * @param signal
  *  optional AbortController.signal
  * @returns {Promise<deck>}
  *  a promise that resolves two updated tables, `reservations` table and `tables` table
  */
 export async function updateTable(tableId, data, signal) {
   const url = new URL(`${API_BASE_URL}/tables/${tableId}/seat`);
   const options = {
     headers,
     signal,
     method: "PUT",
     body: JSON.stringify({ data }),
   };
   return await fetchJson(url, options, []);
 }
 
 /**
  * Sends the delete request to the express server
  * @param tableId
  *  The id of the table that needs to be cleared out.
  * @param signal
  *  optional AbortController.signal
  * @returns {Promise<deck>}
  *  a promise that resolves two updated tables, `reservations` table and `tables` table
  */
 export async function clearFinishedTable(tableId, signal) {
   const url = new URL(`${API_BASE_URL}/tables/${tableId}/seat`);
   const options = {
     headers,
     signal,
     method: "DELETE",
   };
   return await fetchJson(url, options, []);
 }