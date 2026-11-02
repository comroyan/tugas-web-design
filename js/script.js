/**
 * ============================================================================
 * JAVASCRIPT DASAR: SISTEM INVENTARIS PERANGKAT LABORATORIUM TKJ
 * Proyek Akhir Praktik Kejuruan Kelas XII Teknik Komputer dan Jaringan
 * ============================================================================
 * Fitur Multi-Halaman Bersih (Anti-Rumit):
 * 1. Beranda (Dashboard): Status kesiapan alat & distribusi perangkat per kategori
 * 2. Data Inventaris: Tabel & Kartu lengkap dengan pencarian & filter instan
 * 3. Tambah Perangkat: Halaman form terpisah yang lega & nyaman diisi di HP
 * 4. Laporan & Ekspor: Rekapitulasi cetak laporan resmi & ekspor JSON
 * 5. Navigasi: Hamburger Drawer (Garis Tiga), Desktop Nav, dan Mobile Bottom Bar
 * ============================================================================
 */

// 1. STATE GLOBAL APLIKASI
const STORAGE_KEY = 'inventaris_tkj_v2';
const JSON_URL = 'data/perangkat.json';

// Data bawaan awal (kosong: inventaris dimulai dari 0 perangkat)
const DATA_AWAL_FALLBACK = [];

let daftarPerangkat = [];
let idPerangkatDiedit = null;
let idPerangkatDihapus = null;
let modeTampilan = 'table'; // 'table' | 'grid'
let halamanAktif = 'dashboard'; // 'dashboard' | 'inventory' | 'add' | 'report'

// 2. REFERENSI ELEMEN DOM

// Halaman-halaman
const pageDashboard = document.getElementById('pageDashboard');
const pageInventory = document.getElementById('pageInventory');
const pageAdd = document.getElementById('pageAdd');
const pageReport = document.getElementById('pageReport');
const pageAbout = document.getElementById('pageAbout');
const elBtnAboutToInventory = document.getElementById('btnAboutToInventory');

// Navigasi & Drawer
const elBtnHamburgerMenu = document.getElementById('btnHamburgerMenu');
const elBtnCloseDrawer = document.getElementById('btnCloseDrawer');
const elSidebarDrawer = document.getElementById('sidebarDrawer');
const elSidebarOverlay = document.getElementById('sidebarOverlay');

// Badge Total di Navigasi
const elNavBadgeTotal = document.getElementById('navBadgeTotal');
const elDrawerBadgeTotal = document.getElementById('drawerBadgeTotal');

// Dashboard Elements
const elDashPersenKesiapan = document.getElementById('dashPersenKesiapan');
const elDashProgressBar = document.getElementById('dashProgressBar');
const elDashKesiapanNote = document.getElementById('dashKesiapanNote');
const elStatTotalPerangkat = document.getElementById('statTotalPerangkat');
const elStatTotalUnit = document.getElementById('statTotalUnit');
const elStatKondisiBaik = document.getElementById('statKondisiBaik');
const elStatKondisiRusak = document.getElementById('statKondisiRusak');
const elDashCountKomputer = document.getElementById('dashCountKomputer');
const elDashCountRouter = document.getElementById('dashCountRouter');
const elDashCountSwitch = document.getElementById('dashCountSwitch');
const elDashCountAP = document.getElementById('dashCountAP');
const elBtnDashToTambah = document.getElementById('btnDashToTambah');
const elBtnDashToInventory = document.getElementById('btnDashToInventory');
const elBtnDashToReport = document.getElementById('btnDashToReport');

// Halaman Data Inventaris
const elInventoryTambah = document.getElementById('btnInventoryTambah');
const elInputSearch = document.getElementById('inputCari');
const elBtnClearSearch = document.getElementById('btnClearSearch');
const elSelectKategori = document.getElementById('filterKategori');
const elSelectKondisi = document.getElementById('filterKondisi');
const elBtnResetFilter = document.getElementById('btnResetFilter');
const elBtnViewTable = document.getElementById('btnViewTable');
const elBtnViewGrid = document.getElementById('btnViewGrid');
const elTableContainer = document.getElementById('tabelContainer');
const elGridContainer = document.getElementById('gridContainer');
const elTableBody = document.getElementById('tabelBodyPerangkat');
const elEmptyState = document.getElementById('stateKosong');
const elEmptyMessage = document.getElementById('statePesanKosong');
const elLoadingState = document.getElementById('stateLoading');
const elBadgeTotalItem = document.getElementById('badgeTotalItem');

// Halaman Tambah Perangkat Dedicated
const elFormPagePerangkat = document.getElementById('formPagePerangkat');
const elFormPageAlert = document.getElementById('formPageAlert');
const elPageInputNama = document.getElementById('pageInputNama');
const elPageSelectKategori = document.getElementById('pageSelectKategori');
const elPageInputMerek = document.getElementById('pageInputMerek');
const elPageInputJumlah = document.getElementById('pageInputJumlah');
const elPageSelectKondisi = document.getElementById('pageSelectKondisi');
const elPageInputLokasi = document.getElementById('pageInputLokasi');
const elPageInputIp = document.getElementById('pageInputIp');
const elBtnBatalHalamanTambah = document.getElementById('btnBatalHalamanTambah');

// Halaman Laporan
const elReportTotalItem = document.getElementById('reportTotalItem');
const elReportTotalUnit = document.getElementById('reportTotalUnit');
const elReportRasioKondisi = document.getElementById('reportRasioKondisi');
const elReportTableBody = document.getElementById('reportTableBody');
const elBtnExportJson = document.getElementById('btnExportJson');
const elBtnExportCsv = document.getElementById('btnExportCsv');
const elBtnPrintReport = document.getElementById('btnPrintReport');
const elBtnResetData = document.getElementById('btnResetData');

// Modal Edit
const elModalEdit = document.getElementById('modalEdit');
const elFormEditPerangkat = document.getElementById('formEditPerangkat');
const elModalEditAlert = document.getElementById('modalEditAlert');
const elBtnTutupModalEdit = document.getElementById('btnTutupModalEdit');
const elBtnBatalEdit = document.getElementById('btnBatalEdit');
const elEditNama = document.getElementById('editNama');
const elEditKategori = document.getElementById('editKategori');
const elEditMerek = document.getElementById('editMerek');
const elEditJumlah = document.getElementById('editJumlah');
const elEditKondisi = document.getElementById('editKondisi');
const elEditLokasi = document.getElementById('editLokasi');
const elEditIp = document.getElementById('editIp');

// Modal Hapus
const elModalHapus = document.getElementById('modalHapus');
const elNamaPerangkatHapus = document.getElementById('namaPerangkatHapus');
const elBtnKonfirmasiHapus = document.getElementById('btnKonfirmasiHapus');
const elBtnBatalHapus = document.getElementById('btnBatalHapus');
const elBtnTutupModalHapus = document.getElementById('btnTutupModalHapus');

// Wadah Toast Notifikasi
const elToastContainer = document.getElementById('toastContainer');

// ============================================================================
// 3. SISTEM PERPINDAHAN HALAMAN (CLEAN MULTI-PAGE VIEW)
// ============================================================================

function navigasiHalaman(target) {
  halamanAktif = target;

  // Sembunyikan semua halaman
  pageDashboard.classList.remove('active');
  pageInventory.classList.remove('active');
  pageAdd.classList.remove('active');
  pageReport.classList.remove('active');
  if (pageAbout) pageAbout.classList.remove('active');

  // Tampilkan halaman target
  if (target === 'dashboard') {
    pageDashboard.classList.add('active');
  } else if (target === 'inventory') {
    pageInventory.classList.add('active');
    filterDanTampilkan();
  } else if (target === 'add') {
    pageAdd.classList.add('active');
    sembunyikanErrorFormPage();
    elFormPagePerangkat.reset();
    setTimeout(() => elPageInputNama.focus(), 100);
  } else if (target === 'report') {
    pageReport.classList.add('active');
    renderReportPage();
  } else if (target === 'about') {
    if (pageAbout) pageAbout.classList.add('active');
  }

  // Update status tombol navigasi aktif di Desktop
  document.querySelectorAll('.desktop-nav .nav-link').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-nav') === target);
  });

  // Update status tombol navigasi aktif di Drawer
  document.querySelectorAll('.drawer-item-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-nav') === target);
  });

  // Update status tombol navigasi aktif di Mobile Bottom Nav
  document.querySelectorAll('.bottom-nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-nav') === target);
  });

  // Tutup sidebar drawer jika sedang terbuka
  tutupDrawer();

  // Scroll ke atas dengan halus
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================================
// 4. MEMUAT DATA & LOCALSTORAGE PERSISTEN
// ============================================================================

async function loadData() {
  tampilkanLoading(true);

  // Bersihkan data lama jika ada
  if (localStorage.getItem('inventaris_tkj_data')) {
    localStorage.removeItem('inventaris_tkj_data');
  }

  const dataLokal = localStorage.getItem(STORAGE_KEY);

  if (dataLokal !== null) {
    try {
      daftarPerangkat = JSON.parse(dataLokal);
      tampilkanLoading(false);
      updateStatistik();
      filterDanTampilkan();
      renderReportPage();
      return;
    } catch (e) {
      console.warn('Gagal membaca localStorage, memuat file JSON...');
    }
  }

  try {
    const response = await fetch(JSON_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const dataAwal = await response.json();

    daftarPerangkat = Array.isArray(dataAwal) ? dataAwal : [];
    simpanLocalStorage();

    tampilkanLoading(false);
    updateStatistik();
    filterDanTampilkan();
    renderReportPage();
  } catch (error) {
    console.warn('Mode offline atau file://, memuat data bawaan langsung:', error);
    daftarPerangkat = [...DATA_AWAL_FALLBACK];
    simpanLocalStorage();
    tampilkanLoading(false);
    updateStatistik();
    filterDanTampilkan();
    renderReportPage();
  }
}

function simpanLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(daftarPerangkat));
}

// ============================================================================
// 5. UPDATE STATISTIK DINAMIS & KESIAPAN PRAKTIK LAB
// ============================================================================

function updateStatistik() {
  const totalPerangkat = daftarPerangkat.length;
  let jumlahBaik = 0;
  let jumlahRusak = 0;
  let totalSeluruhUnit = 0;

  let unitKomputer = 0;
  let unitRouter = 0;
  let unitSwitch = 0;
  let unitAP = 0;

  daftarPerangkat.forEach((item) => {
    const qty = Number(item.jumlah) || 0;
    totalSeluruhUnit += qty;

    if (item.kondisi === 'Baik') {
      jumlahBaik++;
    } else if (item.kondisi === 'Rusak') {
      jumlahRusak++;
    }

    if (item.kategori === 'Komputer') unitKomputer += qty;
    else if (item.kategori === 'Router') unitRouter += qty;
    else if (item.kategori === 'Switch') unitSwitch += qty;
    else if (item.kategori === 'Access Point') unitAP += qty;
  });

  // Update angka ringkasan
  elStatTotalPerangkat.textContent = totalPerangkat;
  elStatTotalUnit.textContent = `${totalSeluruhUnit} Unit`;
  elStatKondisiBaik.textContent = jumlahBaik;
  elStatKondisiRusak.textContent = jumlahRusak;

  // Update distribusi kategori di dashboard
  elDashCountKomputer.textContent = `${unitKomputer} Unit`;
  elDashCountRouter.textContent = `${unitRouter} Unit`;
  elDashCountSwitch.textContent = `${unitSwitch} Unit`;
  elDashCountAP.textContent = `${unitAP} Unit`;

  // Update persentase kesiapan lab
  const persenBaik = totalPerangkat > 0 ? Math.round((jumlahBaik / totalPerangkat) * 100) : 0;
  elDashPersenKesiapan.textContent = `${persenBaik}%`;
  elDashProgressBar.style.width = `${persenBaik}%`;

  if (totalPerangkat === 0) {
    elDashKesiapanNote.textContent = 'Belum ada data perangkat. Silakan klik "+ Tambah Perangkat" untuk mulai menginput data.';
  } else if (persenBaik === 100) {
    elDashKesiapanNote.textContent = 'Semua perangkat dalam kondisi prima dan siap praktikum.';
  } else if (persenBaik >= 70) {
    elDashKesiapanNote.textContent = `${jumlahRusak} perangkat perlu servis sebelum sesi praktik berikutnya.`;
  } else {
    elDashKesiapanNote.textContent = 'Perhatian: Sebagian besar perangkat membutuhkan perawatan segera.';
  }

  // Update badge jumlah di header dan menu
  if (elNavBadgeTotal) elNavBadgeTotal.textContent = totalPerangkat;
  if (elDrawerBadgeTotal) elDrawerBadgeTotal.textContent = totalPerangkat;
}

// ============================================================================
// 6. PENCARIAN & FILTERING DATA INVENTARIS
// ============================================================================

function filterDanTampilkan() {
  const keyword = (elInputSearch.value || '').trim().toLowerCase();
  const kategori = elSelectKategori.value;
  const kondisi = elSelectKondisi.value;

  if (elBtnClearSearch) {
    elBtnClearSearch.style.display = keyword.length > 0 ? 'block' : 'none';
  }

  const hasilFilter = daftarPerangkat.filter((item) => {
    const cocokNama = keyword === '' || 
      item.nama.toLowerCase().includes(keyword) || 
      (item.ip && item.ip.toLowerCase().includes(keyword)) ||
      (item.merek && item.merek.toLowerCase().includes(keyword));
    const cocokKategori = kategori === 'Semua' || item.kategori === kategori;
    const cocokKondisi = kondisi === 'Semua' || item.kondisi === kondisi;
    return cocokNama && cocokKategori && cocokKondisi;
  });

  renderInventory(hasilFilter);
}

function resetFilter() {
  elInputSearch.value = '';
  elSelectKategori.value = 'Semua';
  elSelectKondisi.value = 'Semua';
  filterDanTampilkan();
}

function renderInventory(dataTampil) {
  if (elBadgeTotalItem) {
    elBadgeTotalItem.textContent = `${dataTampil.length} perangkat ditemukan`;
  }

  if (dataTampil.length === 0) {
    elTableContainer.style.display = 'none';
    elGridContainer.style.display = 'none';
    elEmptyState.style.display = 'block';

    if (daftarPerangkat.length === 0) {
      elEmptyMessage.textContent = 'Belum ada data perangkat laboratorium.';
    } else {
      elEmptyMessage.textContent = 'Tidak ada perangkat yang sesuai dengan pencarian / filter.';
    }
    return;
  }

  elEmptyState.style.display = 'none';

  if (modeTampilan === 'table') {
    elGridContainer.style.display = 'none';
    elTableContainer.style.display = 'block';
    renderTable(dataTampil);
  } else {
    elTableContainer.style.display = 'none';
    elGridContainer.style.display = 'grid';
    renderGrid(dataTampil);
  }
}

function renderTable(dataTampil) {
  elTableBody.innerHTML = '';

  dataTampil.forEach((item) => {
    const tr = document.createElement('tr');
    const isBaik = item.kondisi === 'Baik';
    const badgeClass = isBaik ? 'badge-status baik' : 'badge-status rusak';
    const ipTampil = item.ip && item.ip !== '-' ? item.ip : '-';

    tr.innerHTML = `
      <td class="col-id">#${item.id}</td>
      <td class="col-nama">${escapeHtml(item.nama)}</td>
      <td class="col-kategori">${escapeHtml(item.kategori)}</td>
      <td class="col-merek">${escapeHtml(item.merek)}</td>
      <td class="col-jumlah">${Number(item.jumlah)}</td>
      <td class="col-kondisi">
        <span class="${badgeClass}">
          <span class="dot"></span>
          ${item.kondisi}
        </span>
      </td>
      <td class="col-ip">
        <span style="font-family: var(--font-mono); font-size: 0.775rem; background-color: var(--bg-subtle); padding: 0.15rem 0.4rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">${escapeHtml(ipTampil)}</span>
      </td>
      <td class="col-lokasi">${escapeHtml(item.lokasi)}</td>
      <td class="col-aksi">
        <div class="row-actions">
          <button type="button" class="btn btn-secondary btn-sm btn-edit" data-id="${item.id}" aria-label="Edit ${escapeHtml(item.nama)}">
            Edit
          </button>
          <button type="button" class="btn btn-danger btn-sm btn-hapus" data-id="${item.id}" aria-label="Hapus ${escapeHtml(item.nama)}">
            Hapus
          </button>
        </div>
      </td>
    `;
    elTableBody.appendChild(tr);
  });

  pasangAksiTombol(elTableBody);
}

function renderGrid(dataTampil) {
  elGridContainer.innerHTML = '';

  dataTampil.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'device-card';

    const isBaik = item.kondisi === 'Baik';
    const badgeClass = isBaik ? 'badge-status baik' : 'badge-status rusak';
    const ipTampil = item.ip && item.ip !== '-' ? item.ip : '-';

    card.innerHTML = `
      <div>
        <div class="device-card-header">
          <span class="device-category-tag">${escapeHtml(item.kategori)}</span>
          <span class="${badgeClass}">
            <span class="dot"></span>
            ${item.kondisi}
          </span>
        </div>
        <h3 class="device-card-title">${escapeHtml(item.nama)}</h3>
        <div class="device-meta-row">
          <div class="device-meta-item">
            <span class="device-meta-label">Merek</span>
            <span class="device-meta-val">${escapeHtml(item.merek)}</span>
          </div>
          <div class="device-meta-item">
            <span class="device-meta-label">Kuantitas</span>
            <span class="device-meta-val">${Number(item.jumlah)} Unit</span>
          </div>
          <div class="device-meta-item">
            <span class="device-meta-label">Alamat IP</span>
            <span class="device-meta-val" style="font-family: var(--font-mono); font-size: 0.75rem;">${escapeHtml(ipTampil)}</span>
          </div>
          <div class="device-meta-item">
            <span class="device-meta-label">Lokasi</span>
            <span class="device-meta-val">${escapeHtml(item.lokasi)}</span>
          </div>
        </div>
      </div>
      <div class="device-card-footer">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">#${item.id}</span>
        <div class="row-actions">
          <button type="button" class="btn btn-secondary btn-sm btn-edit" data-id="${item.id}">Edit</button>
          <button type="button" class="btn btn-danger btn-sm btn-hapus" data-id="${item.id}">Hapus</button>
        </div>
      </div>
    `;
    elGridContainer.appendChild(card);
  });

  pasangAksiTombol(elGridContainer);
}

function pasangAksiTombol(container) {
  container.querySelectorAll('.btn-edit').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-id'));
      siapkanEditPerangkat(id);
    });
  });

  container.querySelectorAll('.btn-hapus').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-id'));
      siapkanHapusPerangkat(id);
    });
  });
}

function tampilkanLoading(status) {
  if (elLoadingState) elLoadingState.style.display = status ? 'block' : 'none';
  if (status) {
    elTableContainer.style.display = 'none';
    elGridContainer.style.display = 'none';
    elEmptyState.style.display = 'none';
  }
}

// ============================================================================
// 7. FORM TAMBAH PERANGKAT (DEDICATED PAGE)
// ============================================================================

function simpanFormPage(e) {
  e.preventDefault();

  const nama = elPageInputNama.value.trim();
  const kategori = elPageSelectKategori.value;
  const merek = elPageInputMerek.value.trim();
  const jumlah = parseInt(elPageInputJumlah.value, 10);
  const kondisi = elPageSelectKondisi.value;
  const lokasi = elPageInputLokasi.value.trim();
  const ip = elPageInputIp ? (elPageInputIp.value.trim() || '-') : '-';

  if (!nama) {
    tampilkanErrorFormPage('Nama perangkat wajib diisi.');
    elPageInputNama.focus();
    return;
  }
  if (!kategori) {
    tampilkanErrorFormPage('Kategori wajib dipilih.');
    elPageSelectKategori.focus();
    return;
  }
  if (!merek) {
    tampilkanErrorFormPage('Merek perangkat wajib diisi.');
    elPageInputMerek.focus();
    return;
  }
  if (isNaN(jumlah) || jumlah < 1) {
    tampilkanErrorFormPage('Jumlah unit minimal 1.');
    elPageInputJumlah.focus();
    return;
  }
  if (!lokasi) {
    tampilkanErrorFormPage('Lokasi penempatan wajib diisi.');
    elPageInputLokasi.focus();
    return;
  }

  let newId = 1;
  if (daftarPerangkat.length > 0) {
    const idList = daftarPerangkat.map((p) => p.id);
    newId = Math.max(...idList) + 1;
  }

  const perangkatBaru = {
    id: newId,
    nama,
    kategori,
    merek,
    jumlah,
    kondisi,
    lokasi,
    ip
  };

  daftarPerangkat.push(perangkatBaru);
  simpanLocalStorage();
  updateStatistik();
  renderReportPage();

  elFormPagePerangkat.reset();
  sembunyikanErrorFormPage();
  tampilkanToast(`Perangkat "${nama}" berhasil ditambahkan.`, 'success');

  // Arahkan ke halaman data inventaris
  navigasiHalaman('inventory');
}

function tampilkanErrorFormPage(pesan) {
  elFormPageAlert.textContent = pesan;
  elFormPageAlert.classList.add('show');
}

function sembunyikanErrorFormPage() {
  elFormPageAlert.textContent = '';
  elFormPageAlert.classList.remove('show');
}

// ============================================================================
// 8. MODAL EDIT PERANGKAT
// ============================================================================

function siapkanEditPerangkat(id) {
  const target = daftarPerangkat.find((p) => p.id === id);
  if (!target) return;

  idPerangkatDiedit = id;
  elEditNama.value = target.nama;
  elEditKategori.value = target.kategori;
  elEditMerek.value = target.merek;
  elEditJumlah.value = target.jumlah;
  elEditKondisi.value = target.kondisi;
  elEditLokasi.value = target.lokasi;
  if (elEditIp) elEditIp.value = target.ip && target.ip !== '-' ? target.ip : '';

  elModalEditAlert.classList.remove('show');
  bukaModal(elModalEdit);
  elEditNama.focus();
}

function simpanFormEdit(e) {
  e.preventDefault();

  const nama = elEditNama.value.trim();
  const kategori = elEditKategori.value;
  const merek = elEditMerek.value.trim();
  const jumlah = parseInt(elEditJumlah.value, 10);
  const kondisi = elEditKondisi.value;
  const lokasi = elEditLokasi.value.trim();
  const ip = elEditIp ? (elEditIp.value.trim() || '-') : '-';

  if (!nama || !kategori || !merek || isNaN(jumlah) || jumlah < 1 || !lokasi) {
    elModalEditAlert.textContent = 'Harap isi seluruh field formulir dengan benar.';
    elModalEditAlert.classList.add('show');
    return;
  }

  const idx = daftarPerangkat.findIndex((p) => p.id === idPerangkatDiedit);
  if (idx !== -1) {
    daftarPerangkat[idx] = {
      id: idPerangkatDiedit,
      nama,
      kategori,
      merek,
      jumlah,
      kondisi,
      lokasi,
      ip
    };

    simpanLocalStorage();
    updateStatistik();
    filterDanTampilkan();
    renderReportPage();
    tutupModal(elModalEdit);
    tampilkanToast(`Data "${nama}" berhasil diperbarui.`, 'success');
  }
}

// ============================================================================
// 9. MODAL HAPUS PERANGKAT
// ============================================================================

function siapkanHapusPerangkat(id) {
  const target = daftarPerangkat.find((p) => p.id === id);
  if (!target) return;

  idPerangkatDihapus = id;
  elNamaPerangkatHapus.textContent = `"${target.nama}" (ID: #${target.id})`;
  bukaModal(elModalHapus);
}

function jalankanHapus() {
  if (idPerangkatDihapus === null) return;

  const target = daftarPerangkat.find((p) => p.id === idPerangkatDihapus);
  const namaTarget = target ? target.nama : 'Perangkat';

  daftarPerangkat = daftarPerangkat.filter((p) => p.id !== idPerangkatDihapus);

  simpanLocalStorage();
  updateStatistik();
  filterDanTampilkan();
  renderReportPage();
  tutupModal(elModalHapus);
  idPerangkatDihapus = null;
  tampilkanToast(`Data "${namaTarget}" berhasil dihapus.`, 'info');
}

// ============================================================================
// 10. HALAMAN LAPORAN & EKSPOR
// ============================================================================

function renderReportPage() {
  const totalItem = daftarPerangkat.length;
  let totalUnit = 0;
  let baik = 0;
  let rusak = 0;

  elReportTableBody.innerHTML = '';

  daftarPerangkat.forEach((item) => {
    totalUnit += Number(item.jumlah) || 0;
    if (item.kondisi === 'Baik') baik++;
    else if (item.kondisi === 'Rusak') rusak++;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family: var(--font-mono); font-size: 0.75rem;">#${item.id}</td>
      <td style="font-weight: 600;">${escapeHtml(item.nama)}</td>
      <td>${escapeHtml(item.kategori)}</td>
      <td>${escapeHtml(item.merek)}</td>
      <td style="text-align: center; font-family: var(--font-mono);">${item.jumlah}</td>
      <td>${item.kondisi}</td>
      <td style="font-family: var(--font-mono); font-size: 0.75rem;">${escapeHtml(item.ip || '-')}</td>
      <td>${escapeHtml(item.lokasi)}</td>
    `;
    elReportTableBody.appendChild(tr);
  });

  elReportTotalItem.textContent = `${totalItem} Item`;
  elReportTotalUnit.textContent = `${totalUnit} Unit`;
  elReportRasioKondisi.textContent = `${baik} Baik / ${rusak} Rusak`;
}

function eksporDataJson() {
  if (daftarPerangkat.length === 0) {
    tampilkanToast('Tidak ada data inventaris untuk diekspor.', 'error');
    return;
  }
  const blob = new Blob([JSON.stringify(daftarPerangkat, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `laporan-inventaris-tkj-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  tampilkanToast('Data berhasil diekspor (JSON).', 'success');
}

function eksporDataCsv() {
  if (daftarPerangkat.length === 0) {
    tampilkanToast('Tidak ada data inventaris untuk diekspor ke Excel / CSV.', 'error');
    return;
  }

  const headers = ['ID', 'Nama Perangkat', 'Kategori', 'Merek', 'Jumlah Unit', 'Kondisi', 'Alamat IP', 'Lokasi'];
  const rows = daftarPerangkat.map((item) => [
    item.id,
    `"${(item.nama || '').replace(/"/g, '""')}"`,
    `"${(item.kategori || '').replace(/"/g, '""')}"`,
    `"${(item.merek || '').replace(/"/g, '""')}"`,
    Number(item.jumlah) || 1,
    `"${(item.kondisi || '').replace(/"/g, '""')}"`,
    `"${(item.ip || '-').replace(/"/g, '""')}"`,
    `"${(item.lokasi || '').replace(/"/g, '""')}"`
  ]);

  // Tambahkan UTF-8 BOM (\uFEFF) agar Microsoft Excel langsung membaca teks & format dengan rapi
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `laporan-inventaris-tkj-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  tampilkanToast('Data berhasil diekspor ke format Excel (CSV).', 'success');
}

function cetakLaporan() {
  window.print();
}

async function resetKeDataBawaan() {
  if (!confirm('Apakah Anda yakin ingin mengosongkan / me-reset semua data inventaris?')) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('inventaris_tkj_data');
  daftarPerangkat = [];
  simpanLocalStorage();
  updateStatistik();
  filterDanTampilkan();
  renderReportPage();
  tampilkanToast('Semua data inventaris berhasil dikosongkan.', 'info');
}

// ============================================================================
// 11. MODAL, DRAWER & TOAST HELPERS
// ============================================================================

function bukaModal(modal) {
  if (modal) modal.classList.add('active');
}

function tutupModal(modal) {
  if (modal) modal.classList.remove('active');
}

function bukaDrawer() {
  if (elSidebarDrawer && elSidebarOverlay) {
    elSidebarDrawer.classList.add('active');
    elSidebarOverlay.classList.add('active');
  }
}

function tutupDrawer() {
  if (elSidebarDrawer && elSidebarOverlay) {
    elSidebarDrawer.classList.remove('active');
    elSidebarOverlay.classList.remove('active');
  }
}

function tampilkanToast(pesan, tipe = 'info') {
  if (!elToastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${tipe}`;
  toast.textContent = pesan;
  elToastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================================
// 12. EVENT LISTENERS
// ============================================================================

function inisialisasiEvent() {
  // Tombol Hamburger & Tutup Drawer
  if (elBtnHamburgerMenu) elBtnHamburgerMenu.addEventListener('click', bukaDrawer);
  if (elBtnCloseDrawer) elBtnCloseDrawer.addEventListener('click', tutupDrawer);
  if (elSidebarOverlay) elSidebarOverlay.addEventListener('click', tutupDrawer);

  // Navigasi Link (Desktop, Drawer, dan Mobile Bottom Bar)
  document.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-nav');
      navigasiHalaman(target);
    });
  });

  // Tombol Pintasan di Dashboard
  if (elBtnDashToTambah) elBtnDashToTambah.addEventListener('click', () => navigasiHalaman('add'));
  if (elBtnDashToInventory) elBtnDashToInventory.addEventListener('click', () => navigasiHalaman('inventory'));
  if (elBtnDashToReport) elBtnDashToReport.addEventListener('click', () => navigasiHalaman('report'));

  // Tombol Tambah di Halaman Data Inventaris
  if (elInventoryTambah) elInventoryTambah.addEventListener('click', () => navigasiHalaman('add'));
  if (elBtnBatalHalamanTambah) elBtnBatalHalamanTambah.addEventListener('click', () => navigasiHalaman('inventory'));
  if (elBtnAboutToInventory) elBtnAboutToInventory.addEventListener('click', () => navigasiHalaman('inventory'));

  // Submit Form Tambah Halaman Dedicated
  if (elFormPagePerangkat) elFormPagePerangkat.addEventListener('submit', simpanFormPage);

  // Search & Filter
  if (elInputSearch) elInputSearch.addEventListener('input', filterDanTampilkan);
  if (elBtnClearSearch) {
    elBtnClearSearch.addEventListener('click', () => {
      elInputSearch.value = '';
      filterDanTampilkan();
      elInputSearch.focus();
    });
  }
  if (elSelectKategori) elSelectKategori.addEventListener('change', filterDanTampilkan);
  if (elSelectKondisi) elSelectKondisi.addEventListener('change', filterDanTampilkan);
  if (elBtnResetFilter) elBtnResetFilter.addEventListener('click', resetFilter);

  // Switcher Tabel vs Grid
  if (elBtnViewTable && elBtnViewGrid) {
    elBtnViewTable.addEventListener('click', () => {
      modeTampilan = 'table';
      elBtnViewTable.classList.add('active');
      elBtnViewGrid.classList.remove('active');
      filterDanTampilkan();
    });
    elBtnViewGrid.addEventListener('click', () => {
      modeTampilan = 'grid';
      elBtnViewGrid.classList.add('active');
      elBtnViewTable.classList.remove('active');
      filterDanTampilkan();
    });
  }

  // Modal Edit
  if (elFormEditPerangkat) elFormEditPerangkat.addEventListener('submit', simpanFormEdit);
  if (elBtnTutupModalEdit) elBtnTutupModalEdit.addEventListener('click', () => tutupModal(elModalEdit));
  if (elBtnBatalEdit) elBtnBatalEdit.addEventListener('click', () => tutupModal(elModalEdit));

  // Modal Hapus
  if (elBtnKonfirmasiHapus) elBtnKonfirmasiHapus.addEventListener('click', jalankanHapus);
  if (elBtnBatalHapus) elBtnBatalHapus.addEventListener('click', () => tutupModal(elModalHapus));
  if (elBtnTutupModalHapus) elBtnTutupModalHapus.addEventListener('click', () => tutupModal(elModalHapus));

  // Export & Print & Reset
  if (elBtnExportJson) elBtnExportJson.addEventListener('click', eksporDataJson);
  if (elBtnExportCsv) elBtnExportCsv.addEventListener('click', eksporDataCsv);
  if (elBtnPrintReport) elBtnPrintReport.addEventListener('click', cetakLaporan);
  if (elBtnResetData) elBtnResetData.addEventListener('click', resetKeDataBawaan);

  // Modal Backdrop Click & Keyboard ESC
  window.addEventListener('click', (e) => {
    if (e.target === elModalEdit) tutupModal(elModalEdit);
    if (e.target === elModalHapus) tutupModal(elModalHapus);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      tutupModal(elModalEdit);
      tutupModal(elModalHapus);
      tutupDrawer();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  inisialisasiEvent();
  loadData();
});
