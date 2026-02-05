const inp = document.querySelector("input");
const form = document.querySelector("form");
const titre = document.querySelector("h2");
const carte = document.querySelector(".carte");
const title = document.querySelector(".titre");
const temp = document.querySelector(".temp");
const tm = document.querySelector(".tm");
const j =document.querySelectorAll('.j');
const load =document.querySelector('.loader');
const foot=document.querySelector('footer');
form.addEventListener("submit", foo);
function foo(e) {
  e.preventDefault();
  carte.classList.remove('active')
  load.classList.add('active');
  let toerana = inp.value;
  lagit(toerana);
}
async function lagit(a) {
  const toe = inp.value
    .split(" ")
    .map((b) => b[0].toUpperCase() + b.slice(1).toLowerCase())
    .join(" ");
  const er=inp.value;
  inp.value = "";
  try {
    const reponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${a}&count=10&language=en&format=json`
    );
    if (!reponse.ok) {
      throw new Error(`Erreur HTTP :${reponse.status}`);
    }
    const data = await reponse.json();

    if (data.results[0].name !== toe) {
      throw new Error(`${er} n'est pas un nom de ville valide`);
    } else {
      const lat = data.results[0].latitude;
      const long = data.results[0].longitude;
      const time = data.res;
      titre.innerText = toe;

      tempe(lat, long);
    }
  } catch (Error) {
    alert(Error);
    load.classList.remove('active');
    
  }
}
async function tempe(la, lo) {
  const rep = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1&forecast_hours=6&past_hours=1`
  );
  const dat = await rep.json();
  const ho = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=1&forecast_hours=7`
  );
  const dt = await ho.json();
// inner
  const max = dat.daily.temperature_2m_max[0];
  const min = dat.daily.temperature_2m_min[0];
  const w = dt.hourly.weather_code[0];
  const tp = dt.hourly.temperature_2m[0];
  const d = decode(w);
  title.childNodes[1].innerText = d[1];
  temp.childNodes[1].src= `/public${d[0]}`;
  temp.childNodes[3].innerText = `${Math.round(tp)}°C`;
  tm.childNodes[1].innerText = `${Math.round(max)}°C`;
  tm.childNodes[5].innerText = `${Math.round(min)}°C`;
//   console.log(dt);
//   console.log(dat);


for (i=0;i<6;i++){
    let k=dt.hourly.time[i+1].split('T');
    const f= dt.hourly.time[0].split('T')
     if (f[0]===k[0]){
      j[i].children[0].innerText=`${k[1].split(':')[0]}h`;
    }
    else{
      j[i].children[0].innerText=`${k[0].slice(5)} à ${k[1].split(':')[0]}h`;
    }
    let wco=dt.hourly.weather_code[i+1];
    let dco=decode(wco);
    j[i].children[1].src= `/public${dco[0]}`;
    j[i].children[2].innerText=Math.round(dt.hourly.temperature_2m[i+1])+"°C";
    let taona =new Date();
foot.innerHTML=`Design by Steave Rkt. OpenMeteo &copy${taona.getFullYear()}`;    
}
    if (j[5].children[2].innerText!==""){
      load.classList.remove('active');
      carte.classList.add('active');
    }
 
}
function decode(a) {
  if (a === 0) {
    return ["/jour/01d.svg", "Ciel Dégagé"];
  }

  if (0 < a && a <= 4) {
    return ["/jour/02d.svg", "Partiellement Couvert"];
  }

  if (4 < a && a < 56) {
    return ["/jour/09d.svg", "Bruine"];
  }

  if (56 < a && a <= 65) {
    return ["/jour/10d.svg", "Pluie"];
  }

  if (65 < a && a <= 76) {
    return ["/snowy-6.svg", "Neige"];
  }
  if (76 < a && a <= 86) {
    return ["/jour/10d.svg", "Pluie"];
  } else {
    return ["/jour/11d.svg", "Orage"];
  }
}


