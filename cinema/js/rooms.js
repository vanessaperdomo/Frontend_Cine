let editingRoomId = null;

function showRoomMessage(text, type) {
  const msg = document.getElementById("room-message");
  msg.textContent = text;
  msg.className = "msg " + type;
  setTimeout(() => { msg.className = "msg hidden"; }, 3500);
}

function resetRoomForm() {
  editingRoomId = null;
  document.getElementById("room-form").reset();
  document.getElementById("rooms-form-title").textContent  = "Nueva sala";
  document.getElementById("room-submit-btn").textContent   = "Guardar sala";
  document.getElementById("room-cancel-btn").style.display = "none";
}

function loadRoomForEdit(room) {
  editingRoomId = room.roomId;
  document.getElementById("room-name").value     = room.roomName;
  document.getElementById("room-capacity").value = room.capacity;
  document.getElementById("room-type").value     = room.roomType;
  document.getElementById("rooms-form-title").textContent  = "Editar sala";
  document.getElementById("room-submit-btn").textContent   = "Guardar cambios";
  document.getElementById("room-cancel-btn").style.display = "inline-block";
  document.getElementById("room-form").scrollIntoView({ behavior: "smooth" });
}

function renderRoomsTable(rooms) {
  const tbody = document.getElementById("rooms-tbody");
  if (!rooms.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:24px;color:#666">Sin salas registradas</td></tr>`;
    return;
  }
  tbody.innerHTML = rooms.map(r => `
    <tr>
      <td>${r.roomName}</td>
      <td>${r.capacity} personas</td>
      <td>${r.roomType}</td>
      <td class="actions-cell">
        <button class="btn-edit"   onclick="handleEditRoom('${r.roomId}')">Editar</button>
        <button class="btn-delete" onclick="handleDeleteRoom('${r.roomId}','${r.roomName.replace(/'/g,"\\'")}')">Eliminar</button>
      </td>
    </tr>`).join("");
}

async function loadRooms() {
  try {
    renderRoomsTable(await getAllRooms());
  } catch(e) {
    console.error("Error cargando salas:", e);
  }
}

async function handleEditRoom(id) {
  try { loadRoomForEdit(await getRoomById(id)); }
  catch(e) { showRoomMessage("Error al cargar la sala", "error"); }
}

async function handleDeleteRoom(id, name) {
  if (!confirm(`¿Eliminar la sala "${name}"?`)) return;
  try {
    await deleteRoom(id);
    showRoomMessage("Sala eliminada", "success");
    loadRooms();
  } catch(e) { showRoomMessage(e.message, "error"); }
}

document.getElementById("room-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    roomName: document.getElementById("room-name").value.trim(),
    capacity: parseInt(document.getElementById("room-capacity").value),
    roomType: document.getElementById("room-type").value
  };
  try {
    if (editingRoomId) {
      await updateRoom(editingRoomId, data);
      showRoomMessage("Sala actualizada correctamente", "success");
    } else {
      await createRoom(data);
      showRoomMessage("Sala creada correctamente", "success");
    }
    resetRoomForm();
    loadRooms();
  } catch(e) { showRoomMessage(e.message, "error"); }
});

document.getElementById("room-cancel-btn").addEventListener("click", resetRoomForm);
document.getElementById("rooms-refresh-btn").addEventListener("click", loadRooms);
loadRooms();