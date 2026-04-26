let editingRentalId = null;

function showRentalMessage(text, type) {
  const msg = document.getElementById("rental-message");
  msg.textContent = text;
  msg.className = "msg " + type;
  setTimeout(() => { msg.className = "msg hidden"; }, 3500);
}

function resetRentalForm() {
  editingRentalId = null;
  document.getElementById("rental-form").reset();
  document.getElementById("rentals-form-title").textContent  = "Nueva renta";
  document.getElementById("rental-submit-btn").textContent   = "Guardar renta";
  document.getElementById("rental-cancel-btn").style.display = "none";
}

function fillSelect(selectId, items, valueKey, labelKey, labelKey2 = null) {
  const sel = document.getElementById(selectId);
  sel.innerHTML = `<option value="">Seleccionar...</option>`;
  items.forEach(item => {
    const label = labelKey2 ? `${item[labelKey]} ${item[labelKey2]}` : item[labelKey];
    sel.innerHTML += `<option value="${item[valueKey]}">${label}</option>`;
  });
}

async function loadRentalSelects() {
  try {
    const [clients, movies, rooms] = await Promise.all([
      getAllClients(), getAllMovies(), getAllRooms()
    ]);
    fillSelect("rental-client", clients, "clientId", "firstName", "lastName");
    fillSelect("rental-movie",  movies,  "movieId",  "title");
    fillSelect("rental-room",   rooms,   "roomId",   "roomName");
  } catch(e) {
    console.error("Error cargando selects de rentas:", e);
  }
}

function loadRentalForEdit(rental) {
  editingRentalId = rental.rentalId;
  document.getElementById("rental-client").value = rental.clientId;
  document.getElementById("rental-movie").value  = rental.movieId;
  document.getElementById("rental-room").value   = rental.roomId;
  document.getElementById("rental-date").value   = rental.rentalDate;
  document.getElementById("rental-return").value = rental.returnDate || "";
  document.getElementById("rental-status").value = rental.status;
  document.getElementById("rentals-form-title").textContent  = "Editar renta";
  document.getElementById("rental-submit-btn").textContent   = "Guardar cambios";
  document.getElementById("rental-cancel-btn").style.display = "inline-block";
  document.getElementById("rental-form").scrollIntoView({ behavior: "smooth" });
}

function getStatusBadge(status) {
  const labels = { active:"Activa", returned:"Devuelta", overdue:"Vencida" };
  return `<span class="status-badge status-${status}">${labels[status] || status}</span>`;
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-CO");
}

function renderRentalsTable(rentals) {
  const tbody = document.getElementById("rentals-tbody");
  if (!rentals.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:24px;color:#666">Sin rentas registradas</td></tr>`;
    return;
  }
  tbody.innerHTML = rentals.map(r => `
    <tr>
      <td>${r.clientFullName}</td>
      <td>${r.movieTitle}</td>
      <td>${r.roomName}</td>
      <td>${fmtDate(r.rentalDate)}</td>
      <td>${fmtDate(r.returnDate)}</td>
      <td>${getStatusBadge(r.status)}</td>
      <td class="actions-cell">
        <button class="btn-edit"   onclick="handleEditRental('${r.rentalId}')">Editar</button>
        <button class="btn-delete" onclick="handleDeleteRental('${r.rentalId}')">Eliminar</button>
      </td>
    </tr>`).join("");
}

async function loadRentals() {
  try {
    renderRentalsTable(await getAllRentals());
  } catch(e) {
    console.error("Error cargando rentas:", e);
  }
}

async function handleEditRental(id) {
  try { loadRentalForEdit(await getRentalById(id)); }
  catch(e) { showRentalMessage("Error al cargar la renta", "error"); }
}

async function handleDeleteRental(id) {
  if (!confirm("¿Eliminar esta renta?")) return;
  try {
    await deleteRental(id);
    showRentalMessage("Renta eliminada", "success");
    loadRentals();
  } catch(e) { showRentalMessage(e.message, "error"); }
}

document.getElementById("rental-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    clientId:   document.getElementById("rental-client").value,
    movieId:    document.getElementById("rental-movie").value,
    roomId:     document.getElementById("rental-room").value,
    rentalDate: document.getElementById("rental-date").value,
    returnDate: document.getElementById("rental-return").value || null,
    status:     document.getElementById("rental-status").value
  };
  try {
    if (editingRentalId) {
      await updateRental(editingRentalId, data);
      showRentalMessage("Renta actualizada correctamente", "success");
    } else {
      await createRental(data);
      showRentalMessage("Renta creada correctamente", "success");
    }
    resetRentalForm();
    loadRentals();
  } catch(e) { showRentalMessage(e.message, "error"); }
});

document.getElementById("rental-cancel-btn").addEventListener("click", resetRentalForm);
document.getElementById("rentals-refresh-btn").addEventListener("click", loadRentals);
// Los selects y la tabla se cargan desde index.html cuando el tab de rentas se activa