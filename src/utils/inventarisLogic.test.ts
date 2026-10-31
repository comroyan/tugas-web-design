import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hitungStatistik,
  filterPerangkat,
  generateNextId,
  validasiPerangkat,
  Perangkat
} from './inventarisLogic';

const mockData: Perangkat[] = [
  { id: 1, nama: 'PC Laboratorium 01', kategori: 'Komputer', merek: 'Lenovo', jumlah: 1, kondisi: 'Baik', lokasi: 'Lab TKJ 1' },
  { id: 2, nama: 'Router Cisco 2901', kategori: 'Router', merek: 'Cisco', jumlah: 2, kondisi: 'Rusak', lokasi: 'Server Room' },
  { id: 3, nama: 'Switch Cisco 2960', kategori: 'Switch', merek: 'Cisco', jumlah: 3, kondisi: 'Baik', lokasi: 'Rak Switch' }
];

test('hitungStatistik menghitung total perangkat, kondisi baik, rusak, dan total unit', () => {
  const stats = hitungStatistik(mockData);
  assert.equal(stats.totalPerangkat, 3);
  assert.equal(stats.kondisiBaik, 2);
  assert.equal(stats.kondisiRusak, 1);
  assert.equal(stats.totalUnit, 6);
});

test('generateNextId menghasilkan id maksimum + 1', () => {
  assert.equal(generateNextId(mockData), 4);
  assert.equal(generateNextId([]), 1);
});

test('filterPerangkat memfilter berdasarkan nama (case-insensitive)', () => {
  const hasil = filterPerangkat(mockData, { keyword: 'cisco' });
  assert.equal(hasil.length, 2);
  assert.equal(hasil[0].id, 2);
  assert.equal(hasil[1].id, 3);
});

test('filterPerangkat memfilter kombinasi kategori dan kondisi', () => {
  const hasil = filterPerangkat(mockData, { kategori: 'Router', kondisi: 'Rusak' });
  assert.equal(hasil.length, 1);
  assert.equal(hasil[0].nama, 'Router Cisco 2901');

  const kosong = filterPerangkat(mockData, { kategori: 'Router', kondisi: 'Baik' });
  assert.equal(kosong.length, 0);
});

test('validasiPerangkat menolak data yang tidak lengkap', () => {
  const invalid = validasiPerangkat({ nama: '', kategori: 'Pilih Kategori', jumlah: 0 });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.pesanError.length > 0);
});

test('validasiPerangkat menerima data yang valid', () => {
  const valid = validasiPerangkat({
    nama: 'Access Point MikroTik',
    kategori: 'Access Point',
    merek: 'MikroTik',
    jumlah: 2,
    kondisi: 'Baik',
    lokasi: 'Lab TKJ 2'
  });
  assert.equal(valid.isValid, true);
  assert.equal(valid.pesanError.length, 0);
});
