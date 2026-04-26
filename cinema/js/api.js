/**
 * api.js
 * Capa de comunicación con el backend.
 * Todos los fetch() pasan por aquí — ningún otro archivo llama al backend directamente.
 */

// URL base de la API — si cambia el puerto, solo se modifica aquí
const API_URL = "http://localhost:8080/api/v1";

/**
 * Función genérica para hacer peticiones HTTP.
 * @param {string} endpoint - Ruta relativa, ej: "/movies"
 * @param {string} method   - Método HTTP: GET, POST, PUT, DELETE
 * @param {object} body     - Datos a enviar (solo en POST y PUT)
 * @returns {Promise}       - Respuesta parseada como JSON
 */
async function request(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" }
  };

  // Solo agrega el body si hay datos que enviar
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);

  // Si el servidor responde sin contenido (ej: DELETE exitoso), retornar null
  if (response.status === 204) return null;

  const data = await response.json();

  // Si hubo error HTTP, lanzar excepción con el mensaje del servidor
  if (!response.ok) {
    throw new Error(data.message || "Error en la solicitud");
  }

  return data;
}

/* ==================== MOVIES ==================== */

/** Obtiene todas las películas */
const getAllMovies = () => request("/movies");

/** Obtiene una película por su ID */
const getMovieById = (id) => request(`/movies/${id}`);

/** Crea una nueva película */
const createMovie = (movie) => request("/movies", "POST", movie);

/** Actualiza una película existente */
const updateMovie = (id, movie) => request(`/movies/${id}`, "PUT", movie);

/** Elimina una película */
const deleteMovie = (id) => request(`/movies/${id}`, "DELETE");

/* ==================== CLIENTS ==================== */

/** Obtiene todos los clientes */
const getAllClients = () => request("/clients");

/** Obtiene un cliente por su ID */
const getClientById = (id) => request(`/clients/${id}`);

/** Crea un nuevo cliente */
const createClient = (client) => request("/clients", "POST", client);

/** Actualiza un cliente existente */
const updateClient = (id, client) => request(`/clients/${id}`, "PUT", client);

/** Elimina un cliente */
const deleteClient = (id) => request(`/clients/${id}`, "DELETE");

/* ==================== SCREENING ROOMS ==================== */

/** Obtiene todas las salas */
const getAllRooms = () => request("/screening-rooms");

/** Obtiene una sala por su ID */
const getRoomById = (id) => request(`/screening-rooms/${id}`);

/** Crea una nueva sala */
const createRoom = (room) => request("/screening-rooms", "POST", room);

/** Actualiza una sala existente */
const updateRoom = (id, room) => request(`/screening-rooms/${id}`, "PUT", room);

/** Elimina una sala */
const deleteRoom = (id) => request(`/screening-rooms/${id}`, "DELETE");

/* ==================== RENTALS ==================== */

/** Obtiene todas las rentas */
const getAllRentals = () => request("/rentals");

/** Obtiene una renta por su ID */
const getRentalById = (id) => request(`/rentals/${id}`);

/** Crea una nueva renta */
const createRental = (rental) => request("/rentals", "POST", rental);

/** Actualiza una renta existente */
const updateRental = (id, rental) => request(`/rentals/${id}`, "PUT", rental);

/** Elimina una renta */
const deleteRental = (id) => request(`/rentals/${id}`, "DELETE");