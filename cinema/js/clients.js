let editingClientId = null;

function showClientMessage(text, type) {
  const msg = document.getElementById("client-message");
  msg.textContent = text;
  msg.className = "msg " + type;
  setTimeout(() => { msg.className = "msg hidden"; }, 3500);
}

function resetClientForm() {
  editingClientId = null;
  document.getElementById("client-form").reset();
  document.getElementById("clients-form-title").textContent  = "Nuevo cliente";
  document.getElementById("client-submit-btn").textContent   = "Guardar cliente";
  document.getElementById("client-cancel-btn").style.display = "none";
}

function loadClientForEdit(client) {
  editingClientId = client.clientId;
  document.getElementById("client-firstname").value = client.firstName;
  document.getElementById("client-lastname").value  = client.lastName;
  document.getElementById("client-email").value     = client.email;
  document.getElementById("client-phone").value     = client.phone || "";
  document.getElementById("clients-form-title").textContent  = "Editar cliente";
  document.getElementById("client-submit-btn").textContent   = "Guardar cambios";
  document.getElementById("client-cancel-btn").style.display = "inline-block";
  document.getElementById("client-form").scrollIntoView({ behavior: "smooth" });
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-CO");
}

function renderClientsTable(clients) {
  const tbody = document.getElementById("clients-tbody");
  if (!clients.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:24px;color:#666">Sin clientes registrados</td></tr>`;
    return;
  }
  tbody.innerHTML = clients.map(c => `
    <tr>
      <td>${c.firstName}</td>
      <td>${c.lastName}</td>
      <td>${c.email}</td>
      <td>${c.phone || "—"}</td>
      <td>${formatDate(c.registeredAt)}</td>
      <td class="actions-cell">
        <button class="btn-edit"   onclick="handleEditClient('${c.clientId}')">Editar</button>
        <button class="btn-delete" onclick="handleDeleteClient('${c.clientId}','${c.firstName.replace(/'/g,"\\'")}')">Eliminar</button>
      </td>
    </tr>`).join("");
}

async function loadClients() {
  try {
    renderClientsTable(await getAllClients());
  } catch(e) {
    console.error("Error cargando clientes:", e);
  }
}

async function handleEditClient(id) {
  try { loadClientForEdit(await getClientById(id)); }
  catch(e) { showClientMessage("Error al cargar el cliente", "error"); }
}

async function handleDeleteClient(id, name) {
  if (!confirm(`¿Eliminar al cliente "${name}"?`)) return;
  try {
    await deleteClient(id);
    showClientMessage("Cliente eliminado", "success");
    loadClients();
  } catch(e) { showClientMessage(e.message, "error"); }
}

document.getElementById("client-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    firstName: document.getElementById("client-firstname").value.trim(),
    lastName:  document.getElementById("client-lastname").value.trim(),
    email:     document.getElementById("client-email").value.trim(),
    phone:     document.getElementById("client-phone").value.trim() || null
  };
  try {
    if (editingClientId) {
      await updateClient(editingClientId, data);
      showClientMessage("Cliente actualizado correctamente", "success");
    } else {
      await createClient(data);
      showClientMessage("Cliente creado correctamente", "success");
    }
    resetClientForm();
    loadClients();
  } catch(e) { showClientMessage(e.message, "error"); }
});

document.getElementById("client-cancel-btn").addEventListener("click", resetClientForm);
document.getElementById("clients-refresh-btn").addEventListener("click", loadClients);
loadClients();