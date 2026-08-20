# List Weaver

Buat aplikasi web bernama "ListZone", yaitu aplikasi untuk membuat Ranking dan Tier List.

Gunakan desain modern, clean, minimal, dan responsive. Gunakan sidebar sebagai navigasi utama.

## AUTHENTICATION

Buat halaman Login terlebih dahulu. Untuk versi awal tidak perlu backend authentication; gunakan localStorage. User harus login sebelum bisa masuk ke aplikasi.

## SIDEBAR

Sidebar berisi:

- Dashboard

- Ranking

- Tier List

- Logout

## DASHBOARD

Dashboard menampilkan semua Ranking dan Tier List yang sudah dibuat.

Tambahkan tombol "+ Tambahkan List".

Saat user menekan tombol tersebut, user harus memilih jenis list yang ingin dibuat:

- Ranking

- Tier List

Setelah memilih jenisnya, user dapat menentukan:

- Judul

- Foto profil/cover list

- Apakah menggunakan sistem nilai/scoring atau tidak

Jika memilih Tier List, user juga dapat mengatur tier yang digunakan.

Setiap list yang sudah dibuat memiliki tombol "Detail" untuk membuka editor list tersebut.

## RANKING

Ranking menggunakan sistem urutan:

1, 2, 3, 4, 5, dan seterusnya.

Editor Ranking memiliki dua area utama:

- KIRI: Object Pool

- KANAN: Ranking

Di bagian kiri terdapat tombol "+ Tambahkan Objek".

Saat menambahkan objek, user dapat memasukkan:

- Nama (wajib)

- Foto

- Deskripsi (opsional)

Objek baru muncul sebagai card di Object Pool sebelah kiri.

User dapat drag & drop card dari kiri ke area Ranking di kanan. Setelah masuk, nomor ranking otomatis mengikuti posisinya.

Objek di ranking dapat:

- Diubah urutannya dengan drag & drop

- Dipindahkan kembali ke Object Pool

- Diedit

- Dihapus

## TIER LIST

Tier List memiliki konsep yang sama dengan Ranking.

Editor memiliki:

- KIRI: Object Pool

- KANAN: Tier List

Default tier:

S

A

B

C

User dapat:

- Menambah tier

- Menghapus tier

- Mengubah nama tier

- Mengubah urutan tier

Setiap tier dapat berisi banyak objek.

Objek dapat di-drag:

- Dari Object Pool ke tier

- Dari satu tier ke tier lain

- Untuk mengubah urutan objek dalam tier

- Kembali ke Object Pool

## SISTEM NILAI / SCORING

Saat membuat Ranking atau Tier List, user dapat memilih apakah ingin menggunakan nilai.

Jika aktif, default nilai adalah ⭐ 1–10.

User juga dapat membuat nilai custom, misalnya:

- Perfect

- Absolute Cinema

- Masterpiece

Nilai custom dapat diatur urutannya menggunakan tombol panah atas/bawah.

Contoh:

Perfect

10

9

8

...

1

atau:

10

9

Absolute Cinema

8

...

Jadi urutan nilai sepenuhnya dapat dikustomisasi.

## DATA

Untuk versi awal, simpan seluruh data menggunakan localStorage:

- Login state

- Ranking

- Tier List

- Objects

- Tier

- Score

- Pengaturan masing-masing list

Data harus tetap tersimpan setelah browser di-refresh.

## UI/UX

Buat interface yang modern, rapi, dan mudah digunakan.

Pada halaman editor:

- Object Pool selalu berada di sebelah kiri

- Ranking/Tier List selalu berada di sebelah kanan

- Tombol "+ Tambahkan Objek" berada di Object Pool sebelah kiri

- Gunakan card untuk setiap objek

- Gunakan drag & drop yang smooth dan intuitif

- Berikan feedback visual ketika objek sedang di-drag

- Layout responsive untuk desktop dan tablet

Buat aplikasi terasa seperti tool Ranking/Tier List modern yang benar-benar siap digunakan, bukan sekadar mockup.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8c54a445-5d01-43bb-8132-dbe4d88f9b4c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
