/**
 * Logika Murni Inventaris Laboratorium TKJ
 * Digunakan untuk perhitungan statistik, pencarian, filter, dan validasi data.
 */

export interface Perangkat {
  id: number;
  nama: string;
  kategori: string;
  merek: string;
  jumlah: number;
  kondisi: 'Baik' | 'Rusak';
  lokasi: string;
}

export interface StatistikPerangkat {
  totalPerangkat: number; // Jumlah jenis perangkat terdaftar
  totalUnit: number;      // Total fisik seluruh unit (penjumlahan jumlah)
  kondisiBaik: number;    // Jumlah jenis perangkat berstatus Baik
  kondisiRusak: number;   // Jumlah jenis perangkat berstatus Rusak
}

export interface FilterCriteria {
  keyword?: string;
  kategori?: string;
  kondisi?: string;
}

/**
 * Menghitung statistik inventaris secara dinamis
 */
export function hitungStatistik(daftar: Perangkat[]): StatistikPerangkat {
  const totalPerangkat = daftar.length;
  
  let kondisiBaik = 0;
  let kondisiRusak = 0;
  let totalUnit = 0;

  for (let i = 0; i < daftar.length; i++) {
    const item = daftar[i];
    // Operator aritmetika
    totalUnit += Number(item.jumlah) || 0;

    // Percabangan if/else
    if (item.kondisi === 'Baik') {
      kondisiBaik++;
    } else if (item.kondisi === 'Rusak') {
      kondisiRusak++;
    }
  }

  return {
    totalPerangkat,
    totalUnit,
    kondisiBaik,
    kondisiRusak
  };
}

/**
 * Filter & Pencarian perangkat berdasarkan nama, kategori, dan kondisi
 */
export function filterPerangkat(daftar: Perangkat[], kriteria: FilterCriteria): Perangkat[] {
  const keyword = (kriteria.keyword || '').trim().toLowerCase();
  const kategori = (kriteria.kategori || '').trim();
  const kondisi = (kriteria.kondisi || '').trim();

  return daftar.filter((item) => {
    // Pencarian berdasarkan nama perangkat (case-insensitive)
    const cocokNama = keyword === '' || item.nama.toLowerCase().includes(keyword);

    // Filter berdasarkan kategori
    const cocokKategori = kategori === '' || kategori === 'Semua' || item.kategori.toLowerCase() === kategori.toLowerCase();

    // Filter berdasarkan kondisi
    const cocokKondisi = kondisi === '' || kondisi === 'Semua' || item.kondisi.toLowerCase() === kondisi.toLowerCase();

    // Operator logika AND
    return cocokNama && cocokKategori && cocokKondisi;
  });
}

/**
 * Generate ID unik berikutnya menggunakan Math.max
 */
export function generateNextId(daftar: Perangkat[]): number {
  if (!daftar || daftar.length === 0) {
    return 1;
  }
  const idArray = daftar.map((item) => item.id);
  const maxId = Math.max(...idArray);
  return maxId + 1;
}

/**
 * Validasi form perangkat
 */
export function validasiPerangkat(data: Partial<Perangkat>): { isValid: boolean; pesanError: string[] } {
  const pesanError: string[] = [];

  if (!data.nama || data.nama.trim().length === 0) {
    pesanError.push('Nama perangkat wajib diisi');
  }

  if (!data.kategori || data.kategori.trim().length === 0 || data.kategori === 'Pilih Kategori') {
    pesanError.push('Kategori perangkat harus dipilih');
  }

  if (!data.merek || data.merek.trim().length === 0) {
    pesanError.push('Merek perangkat wajib diisi');
  }

  const jumlahNum = Number(data.jumlah);
  if (isNaN(jumlahNum) || jumlahNum < 1) {
    pesanError.push('Jumlah unit minimal 1');
  }

  if (!data.kondisi || (data.kondisi !== 'Baik' && data.kondisi !== 'Rusak')) {
    pesanError.push('Kondisi perangkat harus Baik atau Rusak');
  }

  if (!data.lokasi || data.lokasi.trim().length === 0) {
    pesanError.push('Lokasi penyimpanan wajib diisi');
  }

  return {
    isValid: pesanError.length === 0,
    pesanError
  };
}
