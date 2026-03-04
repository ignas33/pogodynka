const apiKey = "27b121ad7452a3aaa892018238e70f54";

let jednostka = "metric";
let aktualneMiasto = "Łódź";

const poleMiasta = document.getElementById("poleMiasta");
const przyciskSzukaj = document.getElementById("przyciskSzukaj");
const przyciskJednostek = document.getElementById("przyciskJednostek");
const przyciskMotywu = document.getElementById("przyciskMotywu");
const przyciskLokalizacja = document.getElementById("przyciskLokalizacja");
const komunikat = document.getElementById("komunikat");

przyciskJednostek.addEventListener("click", function() {

    if (jednostka === "metric") {
        jednostka = "imperial";
    } else {
        jednostka = "metric";
    }

    pobierzPogode(aktualneMiasto);
});

przyciskSzukaj.addEventListener("click", function() {
    aktualneMiasto = poleMiasta.value;
    pobierzPogode(aktualneMiasto);
});

poleMiasta.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        aktualneMiasto = poleMiasta.value;
        pobierzPogode(aktualneMiasto);
    }
});

przyciskMotywu.addEventListener("click", function() {
    document.body.classList.toggle("ciemny-motyw");
});

przyciskLokalizacja.addEventListener("click", function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            pobierzPogodeLokalizacja(lat, lon);

        }, function() {
            komunikat.textContent = "Nie udało się pobrać lokalizacji.";
        });
    } else {
        komunikat.textContent = "Twoja przeglądarka nie obsługuje geolokalizacji.";
    }
});

function pobierzPogode(miasto) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + miasto + "&appid=" + apiKey + "&units=" + jednostka + "&lang=pl")
        .then(response => response.json())
        .then(data => {

            //teraz

            const dataDzis = new Date(data.dt * 1000).toLocaleDateString("pl-PL");

            document.getElementById("nazwaMiasta").textContent =
            poleMiasta.value + ", " + data.sys.country + " - " + dataDzis;

            if (jednostka === "metric") {
                symbol = "°C";
                symbol2 = "m/s"
            } else {
                symbol = "°F";
                symbol2 = "mph"
            }

            document.getElementById("temperatura").textContent = data.main.temp + symbol;
            document.getElementById("opisPogody").textContent = data.weather[0].description;
            document.getElementById("wilgotnosc").textContent = data.main.humidity;
            document.getElementById("predkoscWiatru").textContent = data.wind.speed + " "  + symbol2;
            document.getElementById("ikonaPogody").src =
                "https://openweathermap.org/img/wn/" +
                data.weather[0].icon + "@2x.png";

            komunikat.textContent = "";
        })
        .catch(error => {
            komunikat.textContent = error.message;
        });

        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + miasto + "&appid=" + apiKey + "&units=" + jednostka + "&lang=pl")
        .then(response => response.json())
        .then(data => {

            //cały dzień

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
                    <div>Wiatr: ${wiatr} ${symbol2}</div>
                `;

                kontenerDzis.appendChild(div);
            });

            // 5 dni

            const kontener = document.getElementById("kontenerPrognozy");
            kontener.innerHTML = "";

            const daily = data.list.filter(item =>
                item.dt_txt.includes("12:00:00")
            );

            for(let i=0;i<5;i++) {

                let dataTekst = new Date(daily[i].dt_txt).toLocaleDateString("pl-PL");
                let temp = daily[i].main.temp;

                let div = document.createElement("div");
                div.classList.add("ladny-kafelek");

                div.innerHTML = "<strong>" + dataTekst + "</strong><br>" + temp + symbol;

                kontener.appendChild(div);
            }
            

        })
        .catch(error => {
            komunikat.textContent = "Takie miasto nie istnieje. Wpisz poprawnie.";
        });

}

function pobierzPogodeLokalizacja(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=" + jednostka + "&lang=pl")
        .then(response => response.json())
        .then(data => {
            aktualneMiasto = data.name;
            pobierzPogode(aktualneMiasto);
        })
}

pobierzPogode(aktualneMiasto);