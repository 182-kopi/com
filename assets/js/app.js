// === CETAK NOTA - ANTI BLOKIR, TANPA POPUP ===
function printWindow(judul, isiHtml){
  var modal=document.getElementById('modal-cetak');
  var area=document.getElementById('area-cetak');
  if(!modal || !area){ alert('Modal cetak belum ada! Tempel div modal-cetak di index.html dulu Bos'); return; }
  area.innerHTML=isiHtml;
  modal.style.display='block';
  window.scrollTo(0,0);
}
function tutupCetak(){
  document.getElementById('modal-cetak').style.display='none';
}
function cetakArea(){
  window.print();
}
function showPage(page){
  var all=document.querySelectorAll('.page');
  for(var i=0;i<all.length;i++) all[i].classList.remove('active');
  var el=document.getElementById('page-'+page);
  if(el) el.classList.add('active');
  var navs=document.querySelectorAll('#main-nav button');
  for(var j=0;j<navs.length;j++) navs[j].classList.remove('active');
  var nav=document.querySelector('#main-nav button[data-page="'+page+'"]');
  if(nav) nav.classList.add('active');
  var bnavs=document.querySelectorAll('.bottom-nav button');
  for(var k=0;k<bnavs.length;k++) bnavs[k].classList.remove('active');
  var bnav=document.querySelector('.bottom-nav button[data-page="'+page+'"]');
  if(bnav) bnav.classList.add('active');
  var titles={dashboard:'Dashboard',toko:'Data Toko',produk:'Data Produk',titip:'Titip Produk',stok:'Stok & Opname',jual:'Penjualan / Kasir',retur:'Retur',setoran:'Setoran & Piutang',laporan:'Laporan',backup:'Backup',pengaturan:'Pengaturan'};
  var titleEl=document.getElementById('page-title');
  if(titleEl) titleEl.innerText=titles[page]||page;
  window.scrollTo(0,0);
  renderAll();
}
if(document.querySelectorAll('#main-nav button').length>0){
  document.querySelectorAll('#main-nav button').forEach(function(b){
    b.addEventListener('click', function(){ showPage(b.dataset.page); });
  });
}
function openModal(id){ var m=document.getElementById(id); if(m) m.classList.add('open'); }
function closeModal(id){ var m=document.getElementById(id); if(m) m.classList.remove('open'); }
function openModalTokoBaru(){
  document.getElementById('toko-edit-id').value='';
  document.getElementById('toko-nama').value='';
  document.getElementById('toko-pemilik').value='';
  document.getElementById('toko-wa').value='';
  document.getElementById('toko-kota').value='';
  document.getElementById('toko-komisi').value=setting.komisiDefault;
  document.getElementById('modal-toko-title').innerText='Tambah Toko';
  openModal('modal-toko');
}
function saveToko(){
  var editId=document.getElementById('toko-edit-id').value;
  var nama=document.getElementById('toko-nama').value;
  if(!nama){ alert('Nama toko wajib!'); return; }
  var data={nama:nama, pemilik:document.getElementById('toko-pemilik').value, wa:document.getElementById('toko-wa').value, kota:document.getElementById('toko-kota').value, komisi:parseInt(document.getElementById('toko-komisi').value)||15, status:document.getElementById('toko-status').value};
  if(editId){
    for(var i=0;i<tokoList.length;i++){ if(tokoList[i].id===parseInt(editId)){ tokoList[i].nama=data.nama; tokoList[i].pemilik=data.pemilik; tokoList[i].wa=data.wa; tokoList[i].kota=data.kota; tokoList[i].komisi=data.komisi; tokoList[i].status=data.status; } }
    alert('Toko berhasil di-EDIT!');
  } else { data.id=Date.now(); tokoList.push(data); alert('Toko baru tersimpan!'); }
  saveAll(); closeModal('modal-toko'); renderAll();
}
function editToko(id){ var t=getToko(id); if(!t) return; document.getElementById('toko-edit-id').value=t.id; document.getElementById('toko-nama').value=t.nama; document.getElementById('toko-pemilik').value=t.pemilik||''; document.getElementById('toko-wa').value=t.wa||''; document.getElementById('toko-kota').value=t.kota||''; document.getElementById('toko-komisi').value=t.komisi; document.getElementById('toko-status').value=t.status; document.getElementById('modal-toko-title').innerText='Edit Toko - '+t.nama; openModal('modal-toko'); 
}

function delToko(id){ if(!confirm('Hapus toko ini?')) return; tokoList=tokoList.filter(function(x){ return x.id!==id; }); stokToko=stokToko.filter(function(x){ return x.tokoId!==id; }); saveAll(); renderAll(); }
function openModalProdukBaru(){ document.getElementById('produk-edit-id').value=''; document.getElementById('produk-nama').value=''; document.getElementById('produk-barcode').value=''; document.getElementById('produk-modal').value=''; document.getElementById('produk-jual').value=''; document.getElementById('produk-stok').value=''; document.getElementById('modal-produk-title').innerText='Tambah Produk'; openModal('modal-produk'); }
function saveProduk(){
  var editId=document.getElementById('produk-edit-id').value;
  var nama=document.getElementById('produk-nama').value; if(!nama){ alert('Nama produk wajib!'); return; }
  var modal=parseInt(document.getElementById('produk-modal').value)||0; 
  var jual=parseInt(document.getElementById('produk-jual').value)||0;
  var stokBaru=parseInt(document.getElementById('produk-stok').value)||0; // AMBIL STOK DARI FORM

  if(editId){
    for(var i=0;i<produkList.length;i++){ 
      if(produkList[i].id===parseInt(editId)){ 
        produkList[i].nama=nama; 
        produkList[i].barcode=document.getElementById('produk-barcode').value; 
        produkList[i].kategori=document.getElementById('produk-kategori').value; 
        produkList[i].modal=modal; 
        produkList[i].jual=jual; 
        produkList[i].stokGudang=stokBaru; // INI KUNCINYA, YANG KEMARIN HILANG
        produkList[i].stok=stokBaru; // Biar tampil sama di semua tempat
      } 
    }
    alert('Produk berhasil di-EDIT! Stok jadi '+stokBaru+' pcs');
  } else { 
    produkList.push({id:Date.now(), nama:nama, barcode:document.getElementById('produk-barcode').value, kategori:document.getElementById('produk-kategori').value, modal:modal, jual:jual, stokGudang:stokBaru}); 
    alert('Produk baru tersimpan!'); 
  }
  saveAll(); closeModal('modal-produk'); renderAll();
}
function editProduk(id){ var p=getProduk(id); if(!p) return; document.getElementById('produk-edit-id').value=p.id; document.getElementById('produk-nama').value=p.nama; document.getElementById('produk-barcode').value=p.barcode||''; document.getElementById('produk-kategori').value=p.kategori; document.getElementById('produk-modal').value=p.modal; document.getElementById('produk-jual').value=p.jual; document.getElementById('produk-stok').value=p.stokGudang; document.getElementById('modal-produk-title').innerText='Edit Produk - '+p.nama; openModal('modal-produk'); }
function delProduk(id){ if(!confirm('Hapus produk ini?')) return; produkList=produkList.filter(function(x){ return x.id!==id; }); stokToko=stokToko.filter(function(x){ return x.produkId!==id; }); saveAll(); renderAll(); }
function tambahStokGudang(id){ var jml=parseInt(prompt('Tambah stok gudang berapa?','10')); if(!jml) return; var p=getProduk(id); p.stokGudang+=jml; saveAll(); renderAll(); }
function updateTitipInfo(){
  var tokoId=parseInt(document.getElementById('titip-toko').value); var produkId=parseInt(document.getElementById('titip-produk').value); var jml=parseInt(document.getElementById('titip-jumlah').value)||0;
  var p=getProduk(produkId); var t=getToko(tokoId); if(!p||!t) return;
  document.getElementById('titip-info').innerHTML='Produk: <b>'+p.nama+'</b> | Stok Gudang: <b>'+p.stokGudang+'</b> | Mau titip: <b>'+jml+'</b> | Sisa: <b>'+(p.stokGudang-jml)+'</b>';
}
function saveTitip(){
  var tokoId=parseInt(document.getElementById('titip-toko').value); var produkId=parseInt(document.getElementById('titip-produk').value); var jml=parseInt(document.getElementById('titip-jumlah').value)||0;
  var tgl=document.getElementById('titip-tgl').value||todayStr();
  if(!jml){ alert('Jumlah wajib!'); return; }
  var p=getProduk(produkId); if(jml>p.stokGudang){ alert('Stok gudang tidak cukup! Sisa '+p.stokGudang); return; }
  var hargaJual=parseInt(document.getElementById('titip-harga-jual').value)||p.jual;
  p.stokGudang-=jml;
  var existing=getStokToko(tokoId, produkId);
  if(existing){ existing.stok+=jml; existing.hargaJual=hargaJual; } else { stokToko.push({id:Date.now(), tokoId:tokoId, produkId:produkId, stok:jml, hargaJual:hargaJual}); }
  titipList.unshift({id:Date.now(), tokoId:tokoId, produkId:produkId, jumlah:jml, tgl:tgl, hargaJual:hargaJual, catatan:document.getElementById('titip-catatan').value, status:'Aktif'});
  saveAll(); renderAll(); alert('Titip berhasil!');
}
function delTitip(id){ if(!confirm('Hapus riwayat titip ini?')) return; titipList=titipList.filter(function(x){ return x.id!==id; }); saveAll(); renderAll(); }
function saveOpname(){
  var produkId=parseInt(document.getElementById('opname-produk').value); var fisik=parseInt(document.getElementById('opname-jumlah').value);
  if(isNaN(fisik)){ alert('Isi stok fisik!'); return; }
  var p=getProduk(produkId); var selisih=fisik-p.stokGudang;
  opnameList.unshift({id:Date.now(), produkId:produkId, stokLama:p.stokGudang, stokBaru:fisik, selisih:selisih, tgl:todayStr(), ket:document.getElementById('opname-ket').value});
  p.stokGudang=fisik; saveAll(); renderAll(); alert('Opname tersimpan!');
}
function renderJualProduk(){
  var tokoId=parseInt(document.getElementById('jual-toko').value); var q=(document.getElementById('jual-search').value||'').toLowerCase();
  var html='';
  for(var i=0;i<stokToko.length;i++){
    var s=stokToko[i]; if(s.tokoId!==tokoId) continue; if(s.stok<=0) continue;
    var p=getProduk(s.produkId); if(!p) continue; if(q && p.nama.toLowerCase().indexOf(q)===-1) continue;
    html+='<div class="card"><b>'+p.nama+'</b><p class="small muted">Stok: '+s.stok+' • '+fmt(s.hargaJual)+'</p><div class="flex mt"><input type="number" id="qty-'+s.id+'" value="1" min="1" max="'+s.stok+'" style="width:80px"><button class="btn btn-blue btn-sm" onclick="tambahKeranjang('+s.id+')">+ Keranjang</button></div></div>';
  }
  document.getElementById('list-jual-produk').innerHTML=html||'<p class="small muted">Tidak ada stok di toko ini. Titip dulu di menu Titip.</p>';
  renderKeranjang();
}

// === LAPORAN - DAFTAR PENJUALAN BISA DIEDIT ===
function renderLaporanJual(){
  var el = document.getElementById('list-jual-laporan');
  if(!el) return;

  // Isi dropdown toko sekali aja
  var selToko = document.getElementById('filter-jual-toko');
  if(selToko && selToko.options.length<=1){
    (typeof tokoList!=='undefined'?tokoList:[]).forEach(function(t){
      var o=document.createElement('option'); o.value=t.id; o.text=t.nama; selToko.appendChild(o);
    });
  }

  var fToko = selToko ? selToko.value : '';
  var fMetode = document.getElementById('filter-jual-metode') ? document.getElementById('filter-jual-metode').value : '';

  var list = (typeof jualList!=='undefined'?jualList:[]).filter(function(j){
    if(fToko && String(j.tokoId)!==String(fToko)) return false;
    if(fMetode && j.metode!==fMetode) return false;
    return true;
  });

  if(list.length===0){ el.innerHTML='<p class="small muted">Belum ada penjualan untuk filter ini.</p>'; return; }

  var html='';
  list.slice(0,100).forEach(function(j){
    var t=getToko(j.tokoId); var p=getProduk(j.produkId);
    html+='<div style="border:1px solid #eee;border-radius:10px;padding:10px;margin-bottom:8px;font-size:13px">'
      +'<b>'+(t?t.nama:'-')+'</b> • '+j.tgl+' • <b>'+j.metode+'</b><br>'
      +(p?p.nama:'Produk')+' x '+j.qty+' @ '+fmt(j.harga)+' = <b>'+fmt(j.total)+'</b><br>'
      +'Bayar: '+fmt(j.bayar)+' • Kembali: '+fmt(j.kembalian||0)+'<br>'
      +'<button class="btn btn-sm" onclick="ubahMetodeJual('+j.id+')">🔄 Ubah Metode</button> '
      +'<button class="btn btn-red btn-sm" onclick="delJual('+j.id+')">🗑️ Hapus</button>'
      +'</div>';
  });
  el.innerHTML=html;
}

// Ubah Cash -> Hutang, atau Hutang -> Lunas (Cash)
// Ini yang akan nurunin Piutang Rp 2.242.860 Bos
function ubahMetodeJual(id){
  var j = jualList.find(function(x){ return x.id===id; });
  if(!j) return;
  var baru = prompt('Ubah metode jadi apa?\nKetik: Cash / QRIS / Transfer / Hutang', j.metode);
  if(!baru) return;
  baru = baru.trim();
  if(['Cash','QRIS','Transfer','Hutang'].indexOf(baru)===-1){ alert('Metode tidak valid Bos!'); return; }
  j.metode = baru;
  if(baru==='Hutang'){ j.bayar=0; j.kembalian=0; }
  else { j.bayar=j.total; j.kembalian=0; }
  saveAll(); renderAll(); renderLaporanJual();
  alert('Metode diubah jadi '+baru+'.\nPiutang toko ini sekarang: '+fmt(getPiutangToko(j.tokoId))+'\nTotal Piutang: '+fmt(getTotalPiutang()));
}

// Yang lama Bos, tambahkan renderLaporanJual() di dalamnya
function delJual(id){
  if(!confirm('Hapus penjualan ini? Stok akan balik & Piutang berkurang.')) return;
  var j=jualList.find(function(x){ return x.id===id; });
  if(j){ var s=getStokToko(j.tokoId, j.produkId); if(s) s.stok+=j.qty; }
  jualList=jualList.filter(function(x){ return x.id!==id; });
  saveAll(); renderAll(); renderLaporanJual();
}
function tambahKeranjang(stokId){
  var qty=parseInt(document.getElementById('qty-'+stokId).value)||1;
  var s=null; for(var i=0;i<stokToko.length;i++){ if(stokToko[i].id===stokId) s=stokToko[i]; }
  if(!s) return; if(qty>s.stok){ alert('Stok tidak cukup!'); return; }
  var found=null; for(var j=0;j<keranjang.length;j++){ if(keranjang[j].stokId===stokId) found=keranjang[j]; }
  if(found) found.qty+=qty; else keranjang.push({stokId:stokId, tokoId:s.tokoId, produkId:s.produkId, qty:qty, harga:s.hargaJual});
  renderKeranjang();
}
function renderKeranjang(){
  if(keranjang.length===0){ document.getElementById('keranjang').innerHTML='Keranjang kosong'; document.getElementById('keranjang-total').innerHTML=''; return; }
  var html=''; var total=0;
  for(var i=0;i<keranjang.length;i++){ var k=keranjang[i]; var p=getProduk(k.produkId); var sub=k.qty*k.harga; total+=sub; html+='<div class="flex between"><span>'+p.nama+' x '+k.qty+' @ '+fmt(k.harga)+'</span><span><b>'+fmt(sub)+'</b> <button class="btn btn-red btn-sm" onclick="hapusKeranjang('+i+')">X</button></span></div>';
  if(typeof updateBayar==='function') updateBayar();}
  document.getElementById('keranjang').innerHTML=html;
  document.getElementById('keranjang-total').innerHTML='<b>Total: '+fmt(total)+'</b>';
}
function hapusKeranjang(idx){ keranjang.splice(idx,1); renderKeranjang(); }
function getKeranjangTotal(){
  var total=0;
  for(var i=0;i<keranjang.length;i++) total+=keranjang[i].qty*keranjang[i].harga;
  return total;
}
function setBayarPas(){
  document.getElementById('bayar-jumlah').value=getKeranjangTotal();
  updateBayar();
}
function updateBayar(){
  var total=getKeranjangTotal();
  var bayar=parseInt(document.getElementById('bayar-jumlah').value)||0;
  var metode=document.getElementById('bayar-metode').value;
  var kembali=bayar-total;
  var info='Total: <b>'+fmt(total)+'</b>';
  if(metode==='Cash'){
    info+=' • Dibayar: '+fmt(bayar)+' • Kembalian: <b>'+fmt(kembali<0?0:kembali)+'</b>';
    if(bayar<total && total>0) info+='<br><span style="color:red">⚠️ Uang kurang Rp '+fmt(total-bayar)+'</span>';
  } else if(metode==='QRIS' || metode==='Transfer'){
    info+=' • Metode: '+metode+' • Status: Menunggu Konfirmasi • Kembalian: Rp 0';
  } else {
    info+=' • Metode: Hutang / Bon • Akan masuk Piutang Toko';
  }
  document.getElementById('bayar-info').innerHTML=info;
}
  
// === CHECKOUT - SATU-SATUNYA, JANGAN DOBEL ===
function checkout(){
  if(typeof keranjang==='undefined' || keranjang.length===0){ alert('Keranjang kosong!'); return; }
  var total=getKeranjangTotal();
  var metode=document.getElementById('bayar-metode').value;
  var bayar=parseInt(document.getElementById('bayar-jumlah').value)||0;

  if(metode==='Cash' && bayar<total){ alert('Uang Cash kurang! Kurang '+fmt(total-bayar)); return; }
  if(metode!=='Cash' && metode!=='Hutang'){ bayar=total; }
  if(metode==='Hutang'){ bayar=0; }
  var kembalian=metode==='Cash' ? bayar-total : 0;
  var tgl=document.getElementById('jual-tgl').value||todayStr();
  var tokoId=keranjang[0].tokoId;
  var toko=getToko(tokoId);

  for(var i=0;i<keranjang.length;i++){
    var k=keranjang[i]; var p=getProduk(k.produkId); var t=getToko(k.tokoId);
    var tot=k.qty*k.harga; var modalTotal=k.qty*p.modal; var laba=tot-modalTotal; var komisi=t ? Math.round(tot*(t.komisi||0)/100) : 0;
    jualList.unshift({id:Date.now()+i, tokoId:k.tokoId, produkId:k.produkId, qty:k.qty, harga:k.harga, total:tot, modal:modalTotal, laba:laba, labaBersih:laba-komisi, komisi:komisi, tgl:tgl, metode:metode, bayar:bayar, kembalian:kembalian});
    var s=getStokToko(k.tokoId, k.produkId); if(s) s.stok-=k.qty;
  }
  if(metode!=='Hutang'){
    var bersih=total - Math.round(total*(toko? (toko.komisi||0):0)/100);
    setoranList.unshift({id:Date.now(), tokoId:tokoId, jumlah:bersih, tgl:tgl, metode:metode, ket:'Auto dari Kasir - Struk ' + Date.now()});
  }

  var itemsHtml='';
  for(var j=0;j<keranjang.length;j++){ var kj=keranjang[j]; var pj=getProduk(kj.produkId); itemsHtml+='<tr><td>'+(pj?pj.nama:'')+' x '+kj.qty+'</td><td style="text-align:right">'+fmt(kj.qty*kj.harga)+'</td></tr>'; }
  var strukHtml='<div class="header"><h2>'+(setting.nama||'182KOPI')+'</h2><p style="font-size:12px">'+(setting.alamat||'')+'<br>WA '+(setting.wa||'')+'</p><h3>STRUK PENJUALAN</h3></div>'
    +'<p><b>Toko:</b> '+(toko?toko.nama:'')+'<br><b>Tanggal:</b> '+tgl+'<br><b>Metode:</b> '+metode+'</p>'
    +'<table><tr><th>Item</th><th style="text-align:right">Subtotal</th></tr>'+itemsHtml+'</table>'
    +'<p class="right">Total: <b>'+fmt(total)+'</b><br>Dibayar: '+fmt(bayar)+'<br>Kembalian: <b>'+fmt(kembalian)+'</b><br>Komisi Toko ('+(toko?toko.komisi:0)+'%): '+fmt(Math.round(total*(toko?toko.komisi:0)/100))+'</p>'
    +'<p class="center" style="font-size:12px">Terima kasih sudah belanja 🙏<br>Barang yang sudah dibeli tidak dapat ditukar</p>';

  // Simpan dulu data struknya, baru tampilkan
  window._strukTerakhir = {html:strukHtml, total:total, bayar:bayar, kembalian:kembalian, metode:metode};

  keranjang=[];
  document.getElementById('bayar-jumlah').value='';
  saveAll(); renderAll(); renderJualProduk();

  // JANGAN ADA alert() SETELAH printWindow - INI KUNCINYA
  printWindow('Struk Penjualan', strukHtml);
}

function loadReturProduk(){
  var tokoId=parseInt(document.getElementById('retur-toko').value);
  var html='';
  for(var i=0;i<stokToko.length;i++){ if(stokToko[i].tokoId===tokoId){ var p=getProduk(stokToko[i].produkId); if(p) html+='<option value="'+p.id+'">'+p.nama+' (Stok: '+stokToko[i].stok+')</option>'; } }
  document.getElementById('retur-produk').innerHTML=html;
}
function saveRetur(){
  var tokoId=parseInt(document.getElementById('retur-toko').value); var produkId=parseInt(document.getElementById('retur-produk').value); var jml=parseInt(document.getElementById('retur-jumlah').value)||0;
  if(!jml){ alert('Jumlah wajib!'); return; }
  var s=getStokToko(tokoId, produkId); if(!s || jml>s.stok){ alert('Stok toko tidak cukup!'); return; }
  s.stok-=jml;
  var p=getProduk(produkId);
  if(document.getElementById('retur-alasan').value!=='Rusak' && document.getElementById('retur-alasan').value!=='Kadaluarsa'){ p.stokGudang+=jml; }
  returList.unshift({id:Date.now(), tokoId:tokoId, produkId:produkId, jumlah:jml, alasan:document.getElementById('retur-alasan').value, tgl:document.getElementById('retur-tgl').value||todayStr(), ket:document.getElementById('retur-ket').value});
  saveAll(); renderAll(); alert('Retur tersimpan!');
}
function delRetur(id){ returList=returList.filter(function(x){ return x.id!==id; }); saveAll(); renderAll(); }
function saveSetoran(){
  var tokoId=parseInt(document.getElementById('setoran-toko').value); var jml=parseInt(document.getElementById('setoran-jumlah').value)||0;
  if(!jml){ alert('Jumlah wajib!'); return; }
  setoranList.unshift({id:Date.now(), tokoId:tokoId, jumlah:jml, tgl:document.getElementById('setoran-tgl').value||todayStr(), metode:document.getElementById('setoran-metode').value});
  saveAll(); renderAll(); alert('Setoran tersimpan!');
  function bayarTagihan(tokoId, piutang){
  var toko=getToko(tokoId);
  
