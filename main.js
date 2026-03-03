const apiKey = "KLUCZ_API";

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

            document.getElementById("nazwaMiasta").textContent = data.name;

            let symbol;
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



        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + miasto + "&appid=" + apiKey + "&units=" + jednostka + "&lang=pl")
        .then(response => response.json())
        .then(data => {

            const kontener = document.getElementById("kontenerPrognozy");
            kontener.innerHTML = "";

            let symbol;
            if (jednostka === "metric") {
                symbol = "°C";
            } else {
                symbol = "°F";
            }

            for (let i = 0; i < data.list.length; i += 8) {
                let dzien = data.list[i]; 
                let dataTekst = dzien.dt_txt.split(" ")[0]; 
                let temp = dzien.main.temp;

                let div = document.createElement("div"); 
                div.innerHTML = "<strong>" + dataTekst + "</strong><br>" + temp + symbol;

                kontener.appendChild(div);
            }
        })
        .catch(error => {
            komunikat.textContent = error.message;
        });

}


pobierzPogode(aktualneMiasto);
