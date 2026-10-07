import { events } from "./data.js";

const listContainer = document.querySelector("#etkinlik-listesi");
const searchInput = document.querySelector("#arama");
const categorySelect = document.querySelector("#kategori-filtre");
const resultCount = document.querySelector("#sonuc");

// Tarihi '12 Ekim 2026' formatına çeviren yardımcı fonksiyon
function formatTarih(tarihStr) {
    const [gun, ay, yil] = tarihStr.split("-");
    const dateObj = new Date(`${yil}-${ay}-${gun}`);
    return dateObj.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

// Tek bir kartın HTML şablonu
function createCard(event) {
    return `
        <article class="card">
            <div>
                <h3>${event.title}</h3>
                <p><strong>${event.category}</strong></p>
                <p>Tarih: ${formatTarih(event.date)}, ${event.time}</p>
                <p>Yer: ${event.location}</p>
                <p>Kontenjan: ${event.capacity} kişi</p>
                <p>${event.description}</p>
            </div>
            <a href="etkinlik-detay.html?id=${event.id}">Detayları gör →</a>
        </article>
    `;
}

// Kartları ekrana basan fonksiyon
function render(liste) {
    if (!listContainer) return;

    if (liste.length === 0) {
        listContainer.innerHTML = `<p style="grid-column: 1 / -1; color: #666;">Aramanıza uygun etkinlik bulunamadı.</p>`;
    } else {
        listContainer.innerHTML = liste.map(createCard).join("");
    }

    if (resultCount) {
        resultCount.textContent = liste.length === 0 ? "" : `${liste.length} etkinlik listeleniyor.`;
    }
}

// Sayfa mantığı: Ana sayfa mı yoksa Etkinlikler sayfası mı?
if (listContainer) {
    if (listContainer.dataset.limit) {
        // Ana Sayfa: Tarihe göre sırala ve ilk 2'sini al
        const yaklasan = [...events]
            .sort((a, b) => {
                const [gA, aA, yA] = a.date.split("-");
                const [gB, aB, yB] = b.date.split("-");
                return new Date(`${yA}-${aA}-${gA}`) - new Date(`${yB}-${aB}-${gB}`);
            })
            .slice(0, Number(listContainer.dataset.limit));

        render(yaklasan);
    } else {
        // Etkinlikler Sayfası: Kategorileri dinamik doldur ve arama/filtreleme yap
        if (categorySelect) {
            const uniqueCategories = [...new Set(events.map(e => e.category))];
            uniqueCategories.forEach(cat => {
                const opt = document.createElement("option");
                opt.value = cat;
                opt.textContent = cat;
                categorySelect.appendChild(opt);
            });
        }

        function filtrele() {
            const aranan = searchInput ? searchInput.value.toLocaleLowerCase("tr-TR").trim() : "";
            const secilenKategori = categorySelect ? categorySelect.value : "";

            const sonuc = events.filter(e => {
                const metinUyuyor = e.title.toLocaleLowerCase("tr-TR").includes(aranan) ||
                                    e.description.toLocaleLowerCase("tr-TR").includes(aranan) ||
                                    e.location.toLocaleLowerCase("tr-TR").includes(aranan);
                const kategoriUyuyor = secilenKategori === "" || e.category === secilenKategori;
                return metinUyuyor && kategoriUyuyor;
            });

            render(sonuc);
        }

        if (searchInput) searchInput.addEventListener("input", filtrele);
        if (categorySelect) categorySelect.addEventListener("change", filtrele);

        render(events);
    }
}