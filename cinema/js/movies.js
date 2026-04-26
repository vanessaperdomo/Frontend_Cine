let editingMovieId = null;

function showMovieMessage(text, type) {
  const msg = document.getElementById("movie-message");
  msg.textContent = text;
  msg.className = "msg " + type;
  setTimeout(() => { msg.className = "msg hidden"; }, 3500);
}

function resetMovieForm() {
  editingMovieId = null;
  document.getElementById("movie-form").reset();
  document.getElementById("movies-form-title").textContent = "Nueva película";
  document.getElementById("movie-submit-btn").textContent  = "Guardar película";
  document.getElementById("movie-cancel-btn").style.display = "none";
}

function loadMovieForEdit(movie) {
  editingMovieId = movie.movieId;
  document.getElementById("movie-title").value    = movie.title;
  document.getElementById("movie-genre").value    = movie.genre;
  document.getElementById("movie-director").value = movie.director;
  document.getElementById("movie-year").value     = movie.releaseYear;
  document.getElementById("movie-duration").value = movie.durationMin;
  document.getElementById("movie-stock").value    = movie.stock;
  document.getElementById("movies-form-title").textContent  = "Editar película";
  document.getElementById("movie-submit-btn").textContent   = "Guardar cambios";
  document.getElementById("movie-cancel-btn").style.display = "inline-block";
  document.getElementById("movie-form").scrollIntoView({ behavior: "smooth" });
}

function renderMoviesTable(movies) {
  const tbody = document.getElementById("movies-tbody");
  if (!movies.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:24px;color:#666">Sin películas registradas</td></tr>`;
    return;
  }
  tbody.innerHTML = movies.map(m => `
    <tr>
      <td>${m.title}</td>
      <td>${m.genre}</td>
      <td>${m.director}</td>
      <td>${m.releaseYear}</td>
      <td>${m.durationMin} min</td>
      <td>${m.stock}</td>
      <td class="actions-cell">
        <button class="btn-edit"   onclick="handleEditMovie('${m.movieId}')">Editar</button>
        <button class="btn-delete" onclick="handleDeleteMovie('${m.movieId}','${m.title.replace(/'/g,"\\'")}')">Eliminar</button>
      </td>
    </tr>`).join("");
}

async function loadMovies() {
  try {
    renderMoviesTable(await getAllMovies());
  } catch(e) {
    console.error("Error cargando películas:", e);
  }
}

async function handleEditMovie(id) {
  try { loadMovieForEdit(await getMovieById(id)); }
  catch(e) { showMovieMessage("Error al cargar la película", "error"); }
}

async function handleDeleteMovie(id, title) {
  if (!confirm(`¿Eliminar la película "${title}"?`)) return;
  try {
    await deleteMovie(id);
    showMovieMessage("Película eliminada", "success");
    loadMovies();
  } catch(e) { showMovieMessage(e.message, "error"); }
}

document.getElementById("movie-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    title:       document.getElementById("movie-title").value.trim(),
    genre:       document.getElementById("movie-genre").value.trim(),
    director:    document.getElementById("movie-director").value.trim(),
    releaseYear: parseInt(document.getElementById("movie-year").value),
    durationMin: parseInt(document.getElementById("movie-duration").value),
    stock:       parseInt(document.getElementById("movie-stock").value)
  };
  try {
    if (editingMovieId) {
      await updateMovie(editingMovieId, data);
      showMovieMessage("Película actualizada correctamente", "success");
    } else {
      await createMovie(data);
      showMovieMessage("Película creada correctamente", "success");
    }
    resetMovieForm();
    loadMovies();
  } catch(e) { showMovieMessage(e.message, "error"); }
});

document.getElementById("movie-cancel-btn").addEventListener("click", resetMovieForm);
document.getElementById("movies-refresh-btn").addEventListener("click", loadMovies);
loadMovies();