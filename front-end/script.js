const API = '/reviews'; 
const GENRE = ['Horror', 'Komedi', 'Romantis', 'Action', 'Drama', 'Thriller'];
const state = { data: [], tipe: '', genre: '', q: '', urut: 'terbaru', rating: 0, editId: null };

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const tgl = (s) => (s ? String(s).slice(0, 10).split('-').reverse().join('/') : '');
const bintang = (n) => {
  n = Number(n) || 0;
  return [1, 2, 3, 4, 5].map((i) => `<span class="st${n >= i ? ' f' : n >= i - 0.5 ? ' h' : ''}">★</span>`).join('');
};
const cap = (s) => String(s || '').charAt(0).toUpperCase() + String(s || '').slice(1);

async function req(url, opts = {}) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts });
  let body = null;
  try { body = await res.json(); } catch { /* DELETE 204 tidak punya body */ }
  if (!res.ok) throw new Error((body && (body.message || body.error)) || `Terjadi kesalahan (${res.status})`);
  return body;
}

async function muatData() {
  try {
    const b = await req(API);
    state.data = Array.isArray(b) ? b : (b && b.data) || [];
    render();
  } catch (e) {
    toast(e.message, true);
  }
}

function tampil() {
  const urut = {
    terbaru: (a, b) => (b.tanggal_nonton || '').localeCompare(a.tanggal_nonton || ''),
    rating: (a, b) => b.rating - a.rating,
    judul: (a, b) => a.judul.localeCompare(b.judul),
  }[state.urut];
  return state.data
    .filter((r) => (!state.tipe || r.tipe === state.tipe) && (!state.genre || r.genre === state.genre) && r.judul.toLowerCase().includes(state.q))
    .sort(urut);
}

const poster = (r) => (r.poster ? `<img src="${esc(r.poster)}" alt="Poster ${esc(r.judul)}" loading="lazy" onerror="this.remove()">` : '');

function kartu(r) {
  return `<article class="card" data-id="${esc(r.id)}" tabindex="0">
    <div class="poster">${poster(r)}</div>
    <div class="cap">
      <div class="baris"><h3>${esc(r.judul)}</h3>
        <span class="badge t-${esc(r.tipe)}">${esc(cap(r.tipe))}</span>
        <span class="badge g-${esc(r.genre)}">${esc(r.genre)}</span></div>
      <p class="ulasan">${esc(r.ulasan)}</p>
      <div class="baris2"><span class="bintang">${bintang(r.rating)}<small>${r.rating}/5</small></span><span class="tanggal">${tgl(r.tanggal_nonton)}</span></div>
    </div></article>`;
}

function render() {
  const film = state.data.filter((r) => r.tipe === 'film').length;
  const series = state.data.filter((r) => r.tipe === 'series').length;
  const rata = state.data.length ? (state.data.reduce((t, r) => t + Number(r.rating), 0) / state.data.length).toFixed(1) : '-';
  $('#sFilm').textContent = film;
  $('#sSeries').textContent = series;
  $('#sRata').textContent = rata;

  const list = tampil();
  $('#daftar').innerHTML = list.map(kartu).join('');
  $('#kosong').hidden = list.length > 0;
  $('#kosong').textContent = state.data.length ? 'Tidak ada yang cocok dengan filter ini.' : 'Yahh belum ada review yang kamu buat :(. Klik “Tulis Ulasan” untuk menambahkan review.';
}

function bukaDetail(id) {
  const r = state.data.find((x) => String(x.id) === String(id));
  if (!r) return;
  $('#detail').dataset.id = r.id;
  $('#detail').innerHTML = `
    <button class="x" data-tutup aria-label="Tutup">✕</button>
    <div class="poster">${poster(r)}</div>
    <div>
      <h2>${esc(r.judul)}</h2>
      <div class="baris"><span class="badge t-${esc(r.tipe)}">${esc(cap(r.tipe))}</span><span class="badge g-${esc(r.genre)}">${esc(r.genre)}</span></div>
      <p class="bintang">${bintang(r.rating)}<small>${r.rating}/5</small></p>
      <p class="isi">${esc(r.ulasan)}</p>
      <div class="meta"><span>Ditonton ${tgl(r.tanggal_nonton)}</span></div>
      <div class="aksi">
        <button class="btn" data-aksi="edit">Edit</button>
        <button class="btn2" data-aksi="hapus">Hapus</button>
      </div>
    </div>`;
  $('#ovDetail').hidden = false;
}

function setRating(n) {
  state.rating = n;
  document.querySelectorAll('#rate .s').forEach((s) => {
    const i = Number(s.dataset.i);
    s.className = 's' + (n >= i ? ' f' : n >= i - 0.5 ? ' h' : '');
  });
}

function bukaForm(r) {
  const f = $('#form');
  state.editId = r ? r.id : null;
  $('#fJudul').textContent = r ? 'Edit Ulasan' : 'Tulis Ulasan';
  f.judul.value = r ? r.judul : '';
  f.tipe.value = r ? r.tipe : 'film';
  f.genre.value = r ? r.genre : GENRE[0];
  f.ulasan.value = r ? r.ulasan : '';
  f.tanggal_nonton.value = r ? String(r.tanggal_nonton).slice(0, 10) : new Date().toISOString().slice(0, 10);
  f.poster.value = r ? r.poster || '' : '';
  setRating(r ? Number(r.rating) : 0);
  $('#err').textContent = '';
  $('#ovDetail').hidden = true;
  $('#ovForm').hidden = false;
  f.judul.focus();
}

$('#form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target;
  const body = {
    judul: f.judul.value.trim(), tipe: f.tipe.value, genre: f.genre.value, rating: state.rating,
    ulasan: f.ulasan.value.trim(), tanggal_nonton: f.tanggal_nonton.value, poster: f.poster.value.trim(),
  };
  if (!body.judul || !body.ulasan || !body.rating || !body.tanggal_nonton) {
    $('#err').textContent = 'Judul, rating, ulasan, dan tanggal nonton wajib diisi.';
    return;
  }
  try {
    const edit = state.editId !== null;
    await req(edit ? `${API}/${state.editId}` : API, { method: edit ? 'PUT' : 'POST', body: JSON.stringify(body) });
    tutup();
    toast(edit ? 'Perubahan tersimpan' : 'Review ditambahkan');
    muatData();
  } catch (err) {
    $('#err').textContent = err.message;
  }
});

async function hapus(id) {
  if (!confirm('Yakin akan menghapus review ini?')) return;
  try {
    await req(`${API}/${id}`, { method: 'DELETE' });
    tutup();
    toast('Review dihapus');
    muatData();
  } catch (e) {
    toast(e.message, true);
  }
}

function tutup() {
  $('#ovDetail').hidden = true;
  $('#ovForm').hidden = true;
}

let timer;
function toast(pesan, error = false) {
  const t = $('#toast');
  t.textContent = pesan;
  t.classList.toggle('err', error);
  t.classList.add('show');
  clearTimeout(timer);
  timer = setTimeout(() => t.classList.remove('show'), 2600);
}

$('#tipe').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  state.tipe = b.dataset.v;
  document.querySelectorAll('#tipe button').forEach((x) => x.classList.toggle('on', x === b));
  render();
});

$('#genre').addEventListener('click', (e) => {
  const b = e.target.closest('.chip');
  if (!b) return;
  state.genre = state.genre === b.dataset.v ? '' : b.dataset.v; // klik lagi = lepas filter
  document.querySelectorAll('.chip').forEach((x) => x.classList.toggle('on', x.dataset.v === state.genre));
  render();
});

$('#q').addEventListener('input', (e) => { state.q = e.target.value.trim().toLowerCase(); render(); });
$('#urut').addEventListener('change', (e) => { state.urut = e.target.value; render(); });
$('#tulis').addEventListener('click', () => bukaForm(null));

$('#daftar').addEventListener('click', (e) => { const c = e.target.closest('.card'); if (c) bukaDetail(c.dataset.id); });
$('#daftar').addEventListener('keydown', (e) => { if (e.key === 'Enter') { const c = e.target.closest('.card'); if (c) bukaDetail(c.dataset.id); } });

$('#detail').addEventListener('click', (e) => {
  const aksi = e.target.dataset.aksi;
  const id = $('#detail').dataset.id;
  if (aksi === 'edit') bukaForm(state.data.find((x) => String(x.id) === String(id)));
  if (aksi === 'hapus') hapus(id);
});

document.addEventListener('click', (e) => {
  if (e.target.matches('[data-tutup]') || e.target.classList.contains('ov')) tutup();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') tutup(); });

$('#genre').innerHTML = GENRE.map((g) => `<button class="chip g-${g}" data-v="${g}">${g}</button>`).join('');
$('#fGenre').innerHTML = GENRE.map((g) => `<option>${g}</option>`).join('');
$('#rate').innerHTML = [1, 2, 3, 4, 5].map((i) =>
  `<span class="s" data-i="${i}">★<button type="button" class="h1" data-n="${i - 0.5}" aria-label="${i - 0.5} bintang"></button><button type="button" class="h2" data-n="${i}" aria-label="${i} bintang"></button></span>`
).join('');
$('#rate').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setRating(Number(b.dataset.n)); });

muatData();