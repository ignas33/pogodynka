const apiKey = "27b121ad7452a3aaa892018238e70f54";

let jednostka = "metric";
let aktualneMiasto = "Łódź";

const poleMiasta = document.getElementById("poleMiasta");
const przyciskSzukaj = document.getElementById("przyciskSzukaj");
const przyciskJednostek = document.getElementById("przyciskJednostek");
const przyciskMotywu = document.getElementById("przyciskMotywu");
const komunikat = document.getElementById("komunikat");

przyciskJednostek.addEventListener("click", function () {

    if (jednostka === "metric") {
        jednostka = "imperial";
    } else {
        jednostka = "metric";
    }

    pobierzPogode(aktualneMiasto);
});

przyciskSzukaj.addEventListener("click", function () {
    aktualneMiasto = poleMiasta.value;
    pobierzPogode(aktualneMiasto);
});

poleMiasta.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        aktualneMiasto = poleMiasta.value;
        pobierzPogode(aktualneMiasto);
    }
});

// zmiana motywu (classList.toggle – przykład z dokumentacji)
przyciskMotywu.addEventListener("click", function () {
    document.body.classList.toggle("ciemny-motyw");
});

function pobierzPogode(miasto) {

    komunikat.textContent = "Ładowanie...";

    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + miasto + "&appid=" + apiKey + "&units=" + jednostka + "&lang=pl")
        .then(response => response.json())
        .then(data => {

            const dataDzis = new Date(data.dt * 1000).toLocaleDateString("pl-PL");

            document.getElementById("nazwaMiasta").textContent =
            data.name + " - " + dataDzis;

            if (jednostka === "metric") {
                symbol = "°C";
            } else {
                symbol = "°F";
            }

            document.getElementById("temperatura").textContent = data.main.temp + symbol;

            document.getElementById("opisPogody").textContent = data.weather[0].description;

            document.getElementById("wilgotnosc").textContent = data.main.humidity;

            document.getElementById("predkoscWiatru").textContent = data.wind.speed;

            document.getElementById("ikonaPogody").src =
                "https://openweathermap.org/img/wn/" +
                data.weather[0].icon + "@2x.png";

            komunikat.textContent = "";
        })
        .catch(error => {
            komunikat.textContent = error.message;
        });

        //poniżej pobieranie na 5 dni

        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + miasto + "&appid=" + apiKey + "&units=" + jednostka + "&lang=pl")
        .then(response => response.json())
        .then(data => {

            let symbol;
            if (jednostka === "metric") {
                symbol = "°C";
            } else {
                symbol = "°F";
            }

            const teraz = new Date();
            const dzisiaj = teraz.toISOString().split("T")[0];

            const prognozaDzis = data.list.filter(item =>
                item.dt_txt.startsWith(dzisiaj)
            );

            const kontenerDzis = document.getElementById("kontenerPrognozyDzis");
            kontenerDzis.innerHTML = "";

            prognozaDzis.forEach(godzina => {

                let godzinaTekst = godzina.dt_txt.split(" ")[1].slice(0,5);
                let temp = godzina.main.temp;
                let opis = godzina.weather[0].description;
                let ikona = godzina.weather[0].icon;
                let wilgotnosc = godzina.main.humidity;
                let wiatr = godzina.wind.speed;


                let div = document.createElement("div");
                div.classList.add("ladny-kafelek");

                div.innerHTML = `
                    <div><strong>${godzinaTekst}</strong></div>
                    <img src="https://openweathermap.org/img/wn/${ikona}@2x.png">
                    <div>${temp}${symbol}</div>
                    <div>${opis}</div>
                    <div>Wilgotność: ${wilgotnosc}%</div>
                    <div>Wiatr: ${wiatr} m/s</div>
                `;

                kontenerDzis.appendChild(div);
            });

            const kontener = document.getElementById("kontenerPrognozy");
            kontener.innerHTML = "";

            const daily = data.list.filter(item =>
                item.dt_txt.includes("12:00:00")
            );

            daily.forEach(dzien => {

                let dataTekst = new Date(dzien.dt_txt).toLocaleDateString("pl-PL");
                let temp = dzien.main.temp;

                let div = document.createElement("div");
                div.classList.add("ladny-kafelek");

                div.innerHTML = "<strong>" + dataTekst + "</strong><br>" + temp + symbol;

                kontener.appendChild(div);
            });

        })
        .catch(error => {
            komunikat.textContent = error.message;
        });

}

pobierzPogode(aktualneMiasto);