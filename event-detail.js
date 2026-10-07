import { events } from "./data.js";

const container = document.querySelector("#detay");

// URL parametresinden ?id= değerini al
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Etkinliği bul
const event = events.find((e) => e.id === id);

// Tarih formatlama
function formatTarih(tarihStr) {
    if (!tarihStr) return "";
    const [gun, ay, yil] = tarihStr.split("-");
    const dateObj = new Date(`${yil}-${ay}-${gun}`);
    return dateObj.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

if (!container) {
    // Container bulunamadıysa işlem yapma
} else if (!event) {
    // id yoksa veya eşleşen etkinlik bulunamadıysa hata kutusu
    document.title = "Etkinlik Bulunamadı";
    container.innerHTML = `
        <div style="border: 2px solid var(--renk-hata); background: #ffebee; padding: 1.5rem; border-radius: var(--kose); margin-bottom: 1rem;">
            <h2 style="color: var(--renk-hata); margin-bottom: 0.5rem;">Etkinlik bulunamadı</h2>
            <p style="margin-bottom: 1rem;">${id ? `"${id}" numaralı bir etkinlik yok.` : "Herhangi bir etkinlik seçilmedi."} Listeden bir etkinlik seçin.</p>
            <a href="etkinlikler.html" class="btn-link">← Listeye dön</a>
        </div>
    `;
} else {
    // Etkinlik bulunduysa içeriği ve sekme başlığını doldur
    document.title = `${event.title} - Detay`;

    container.innerHTML = `
        <h2>${event.title}</h2>
        <div class="detay-container">
            <figure>
                <img src="afis.jpg" alt="${event.title} afişi" onerror="this.style.display='none'">
                <figcaption>${event.title} afişi</figcaption>
            </figure>

            <dl>
                <dt>Tarih</dt>
                <dd><time datetime="${event.date}T${event.time}">${formatTarih(event.date)}, ${event.time}</time></dd>

                <dt>Yer</dt>
                <dd>${event.location}</dd>

                <dt>Kategori</dt>
                <dd>${event.category}</dd>

                <dt>Kontenjan</dt>
                <dd>${event.capacity} kişi</dd>
            </dl>
        </div>

        <div class="aciklama-kutusu">
            <h3>Açıklama</h3>
            <p>${event.description}</p>
        </div>

        <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <a href="etkinlikler.html" class="btn-link">← Listeye dön</a>
            <a href="etkinlik-guncelle.html?id=${event.id}" class="btn-link" style="color: #ffffff; background-color: var(--renk-ana); padding: 0.5rem 1rem; border-radius: var(--kose); text-decoration: none;">Bu etkinliği güncelle</a>
        </div>
    `;
}