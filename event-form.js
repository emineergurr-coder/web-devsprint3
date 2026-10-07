import { events } from "./data.js";

const form = document.querySelector("#etkinlik-formu");
const formMesaj = document.querySelector("#form-mesaj");

if (form) {
    const mode = form.dataset.mode; // "ekle" veya "guncelle"

    // --- GÜNCELLEME MODU KONTROLÜ (Adım 11) ---
    if (mode === "guncelle") {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        const etkinlik = events.find((e) => e.id === id);

        if (!etkinlik) {
            // id yoksa veya listede bulunamadıysa formu gizle, uyarı göster
            form.outerHTML = `
                <div style="border: 2px solid var(--renk-hata); background: #ffebee; padding: 1.5rem; border-radius: var(--kose); margin-bottom: 1rem;">
                    <h2 style="color: var(--renk-hata); margin-bottom: 0.5rem;">Güncellenecek etkinlik seçilmedi</h2>
                    <p style="margin-bottom: 1rem;">Önce listeden bir etkinlik seçin, detay sayfasındaki "Bu etkinliği güncelle" butonunu kullanın.</p>
                    <a href="etkinlikler.html" class="btn-link">← Etkinliklere git</a>
                </div>
            `;
        } else {
            // Formu mevcut etkinliğin bilgileriyle doldur
            if (form.elements["ad"]) form.elements["ad"].value = etkinlik.title;
            if (form.elements["kategori"]) form.elements["kategori"].value = etkinlik.category;
            
            // GG-AA-YYYY formatını HTML date input'un istediği YYYY-AA-GG formatına çevir
            if (form.elements["tarih"] && etkinlik.date) {
                const [gun, ay, yil] = etkinlik.date.split("-");
                form.elements["tarih"].value = `${yil}-${ay}-${gun}`;
            }
            if (form.elements["saat"]) form.elements["saat"].value = etkinlik.time;
            if (form.elements["yer"]) form.elements["yer"].value = etkinlik.location;
            if (form.elements["kontenjan"]) form.elements["kontenjan"].value = etkinlik.capacity;
            if (form.elements["aciklama"]) form.elements["aciklama"].value = etkinlik.description;
        }
    }

    // --- SUBMIT VE DOĞRULAMA (Adım 9 ve 10) ---
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Sayfa yenilenmesini engelle

        // Form alanlarını oku
        const fd = new FormData(form);
        const data = {
            id: mode === "guncelle" ? new URLSearchParams(window.location.search).get("id") : "event-7",
            title: (fd.get("ad") || "").trim(),
            category: fd.get("kategori") || "",
            date: fd.get("tarih") || "",
            time: fd.get("saat") || "",
            location: (fd.get("yer") || "").trim(),
            capacity: fd.get("kontenjan") ? Number(fd.get("kontenjan")) : null,
            description: (fd.get("aciklama") || "").trim()
        };

        // Eski hata mesajlarını temizle
        const hataSpanlari = form.querySelectorAll(".hata-metni");
        hataSpanlari.forEach((s) => (s.textContent = ""));
        const inputs = form.querySelectorAll("input, select, textarea");
        inputs.forEach((i) => i.removeAttribute("aria-invalid"));
        if (formMesaj) formMesaj.innerHTML = "";

        // Hata kontrolü
        const errors = {};

        if (data.title.length < 3) {
            errors.ad = "Etkinlik adı en az 3 karakter olmalı.";
        }
        if (!data.category) {
            errors.kategori = "Bir kategori seçin.";
        }
        if (!data.date) {
            errors.tarih = "Tarih seçin.";
        }
        if (!data.time) {
            errors.saat = "Saat seçin.";
        }
        if (!data.location) {
            errors.yer = "Yer bilgisini yazın.";
        }
        if (data.capacity !== null && (isNaN(data.capacity) || data.capacity < 1 || data.capacity > 1000)) {
            errors.kontenjan = "Kontenjan 1 ile 1000 arasında olmalı.";
        }

        // Hataları ekrana bas
        for (const [alanAd, mesaj] of Object.entries(errors)) {
            const span = form.querySelector(`#${alanAd}-hata`);
            const input = form.elements[alanAd];
            if (span) span.textContent = mesaj;
            if (input) input.setAttribute("aria-invalid", "true");
        }

        // Hata varsa durdur
        if (Object.keys(errors).length > 0) {
            if (formMesaj) {
                formMesaj.innerHTML = `
                    <div style="border: 1px solid var(--renk-hata); background: #ffebee; color: var(--renk-hata); padding: 0.8rem; border-radius: var(--kose); margin-top: 1rem;">
                        Lütfen formdaki hatalı alanları düzeltin.
                    </div>
                `;
            }
            return;
        }

        // Hata yoksa: Başarı kutusu ve JSON çıktısı
        const basariMetni = mode === "guncelle" ? "Etkinlik güncellendi (bu sprintte kaydedilmez):" : "Etkinlik oluşturuldu (bu sprintte kaydedilmez):";
        if (formMesaj) {
            formMesaj.innerHTML = `
                <div style="border: 2px solid #2e7d32; background: #e8f5e9; color: #1b5e20; padding: 1rem; border-radius: var(--kose); margin-top: 1.5rem;">
                    <p style="font-weight: bold; margin-bottom: 0.5rem;">${basariMetni}</p>
                    <pre style="background: #ffffff; padding: 0.8rem; border-radius: 4px; overflow-x: auto; font-family: monospace; font-size: 0.9rem; border: 1px solid #c8e6c9;">${JSON.stringify(data, null, 2)}</pre>
                </div>
            `;
        }
    });
}