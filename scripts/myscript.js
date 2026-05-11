const urunlerDB = {
    'cubuklu': { ad: '2026 Çubuklu Forma', fiyat: 1499, resim: '../img/cubuklu.jpg', aciklama: 'Fenerbahçe 2025-2026 sezonunda giyeceği efsanevi çubuklu forma. Teri emen özel kumaş yapısı ile maksimum konfor sağlar.' },
    'deplasman': { ad: '2026 Deplasman Forması', fiyat: 1499, resim: '../img/deplasman.jpg', aciklama: 'Fenerbahçe deplasman maçlarındaki gururumuz. Hafif, nefes alabilen yapısı ile terletmez.' },
    'atki': { ad: 'Klasik Taraftar Atkısı', fiyat: 250, resim: '../img/atki.jpg', aciklama: 'Soğuk kış günlerinde içinizi ısıtacak, tribünlerin vazgeçilmezi klasik dokuma taraftar atkısı.' },
    'sapka': { ad: 'Lacivert Şapka', fiyat: 300, resim: '../img/sapka.jpg', aciklama: 'Günlük kullanıma uygun, şık tasarımlı ve orijinal kulüp armalı kaliteli lacivert şapka.' }
};

document.addEventListener("DOMContentLoaded", function() {
    
    // Quiz Butonu Dinleyicisi
    const quizBtn = document.getElementById("quiz-cevapla-btn");
    if(quizBtn) {
        quizBtn.addEventListener("click", quizKontrol);
    }

    // Ürün İnceleme Butonları Dinleyicisi
    const inceleButonlari = document.querySelectorAll(".incele-buton");
    inceleButonlari.forEach(btn => {
        btn.addEventListener("click", function() {
            let urunKodu = this.getAttribute("data-urun");
            let urun = urunlerDB[urunKodu];
            localStorage.setItem("aktifUrun", JSON.stringify(urun));
        });
    });

    // Detay Sayfası Yüklenmesi
    if (window.location.pathname.includes("detay.html")) {
        let secilenUrun = JSON.parse(localStorage.getItem("aktifUrun"));
        if (secilenUrun) {
            document.querySelector(".detay-bilgi h2").innerText = secilenUrun.ad;
            document.querySelector(".fiyat").innerText = secilenUrun.fiyat + " TL";
            document.querySelector(".detay-resim img").src = secilenUrun.resim;
            document.getElementById("urun-aciklama").innerText = secilenUrun.aciklama;
        }

        const sepeteEkleBtn = document.getElementById("sepete-ekle-btn");
        if(sepeteEkleBtn) {
            sepeteEkleBtn.addEventListener("click", sepeteEkle);
        }
    }

    // Sepet Sayfası Yüklenmesi
    if (window.location.pathname.includes("sepet.html")) {
        sepetiGoster();
        
        const siparisiTamamlaBtn = document.getElementById("siparisi-tamamla-btn");
        if(siparisiTamamlaBtn) {
            siparisiTamamlaBtn.addEventListener("click", siparisiTamamla);
        }
    }
});

function sepetiGoster() {
    let sepet = JSON.parse(localStorage.getItem("sepetim")) || [];
    let tablo = document.querySelector(".sepet-tablo");
    let toplamAlan = document.getElementById("sepet-toplam");

    if (tablo) {
        while(tablo.rows.length > 1) { tablo.deleteRow(1); } 
        
        let toplam = 0;
        if (sepet.length === 0) {
            let row = tablo.insertRow();
            row.innerHTML = `<td colspan="5" class="bos-sepet-mesaji">Sepetiniz boş.</td>`;
        } else {
            sepet.forEach(urun => {
                let row = tablo.insertRow();
                row.innerHTML = `<td><img src="${urun.resim}" width="50"></td>
                                 <td>${urun.ad}</td>
                                 <td>Standart</td>
                                 <td>1</td>
                                 <td>${urun.fiyat} TL</td>`;
                toplam += parseInt(urun.fiyat);
            });
        }
        if(toplamAlan) toplamAlan.innerText = toplam;
    }
}

function sepeteEkle() {
    let urun = JSON.parse(localStorage.getItem("aktifUrun"));
    if(urun) {
        let sepet = JSON.parse(localStorage.getItem("sepetim")) || [];
        sepet.push(urun);
        localStorage.setItem("sepetim", JSON.stringify(sepet));
        alert("Ürün başarıyla sepetinize eklendi!");
    }
}

function siparisiTamamla() {
    let sepet = JSON.parse(localStorage.getItem("sepetim")) || [];
    if (sepet.length === 0) {
        alert("Sepetiniz zaten boş!");
    } else {
        alert("Siparişiniz başarıyla alındı! Teşekkür ederiz.");
        localStorage.removeItem("sepetim"); 
        sepetiGoster(); 
    }
}

// 5 Soruluk Quiz Puanlama Sistemi
function quizKontrol() {
    let dogruSayisi = 0;
    let toplamSoru = 5;

    for (let i = 1; i <= toplamSoru; i++) {
        let secenekler = document.getElementsByName('q' + i);
        for (let j = 0; j < secenekler.length; j++) {
            if (secenekler[j].checked && secenekler[j].value === "dogru") {
                dogruSayisi++;
            }
        }
    }

    let sonucAlani = document.getElementById("quiz-sonuc");
    sonucAlani.classList.remove("dogru-cevap", "yanlis-cevap");

    if (dogruSayisi === 5) {
        sonucAlani.innerText = "Tebrikler! 5'te 5 yaptınız. Gerçek bir Fenerbahçelisiniz!";
        sonucAlani.classList.add("dogru-cevap");
    } else if (dogruSayisi >= 3) {
        sonucAlani.innerText = "İyi iş! 5 sorudan " + dogruSayisi + " tanesini doğru bildiniz.";
        sonucAlani.classList.add("dogru-cevap");
    } else {
        sonucAlani.innerText = "Maalesef 5 sorudan sadece " + dogruSayisi + " doğru yapabildiniz. Biraz daha çalışmalısınız.";
        sonucAlani.classList.add("yanlis-cevap");
    }
}