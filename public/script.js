async function fetchData() {
  const res = await fetch('/api/data');
  const data = await res.json();

  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const day = days[now.getDay()];

  document.getElementById('background').src = './src/img/backgrounds/'+ data.pages[0].background;

  updateLunchMenu('entree', data.lunch[day].entree);
  updateLunchMenu('main', data.lunch[day].main);
  updateLunchMenu('side', data.lunch[day].side);
  updateLunchMenu('dessert', data.lunch[day].dessert);

  updateTeacherAbsence(data.absent_teachers);
}

function updateLunchMenu(sectionId, items) {
  console.log(items);
  const section = document.getElementById(sectionId);

  // Clear previous content
  section.innerHTML = '';

  // Add new items
  items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      section.appendChild(li);
  });
}

function updateTeacherAbsence(teachers) {
  console.log(teachers);
  const absenceList = document.getElementById('absence-list');
  absenceList.innerHTML = ''; // Clear previous content

  teachers.forEach(teacher => {
      const li = document.createElement('li');
      li.textContent = teacher;
      absenceList.appendChild(li);
  });
}

function updateTime() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString('fr-FR', options);
  document.getElementById('date').textContent = formattedDate;

  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const formattedTime = now.toLocaleTimeString('fr-FR', timeOptions);
  document.getElementById('time').textContent = formattedTime;
}

// Weather Forecast
async function fetchWeather() {
  const res = await fetch('/api/weather');
  const data = await res.json();

  const weather = data.current_weather;
  console.log(weather);
  const weatherCode = weather.weathercode;
  console.log(weatherCode);
  const temperature = weather.temperature;
  document.getElementById('temperature').textContent = `${temperature} °C`;



  document.getElementById('weather-icon').src = `./src/img/weather/${weather.weathercode}${weather.is_day ? 'd' : 'n'}.png`;
}

setInterval(fetchWeather, 60000); // Update weather every minute
fetchWeather();

setInterval(updateTime, 1000); // Update time every second
updateTime();

setInterval(fetchData, 5000); // Every 30 seconds like a ✨ninja✨
fetchData();