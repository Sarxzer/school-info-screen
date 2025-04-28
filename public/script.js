async function fetchData() {
  const res = await fetch('/api/data');
  const data = await res.json();

  document.getElementById('background').src = './src/img/backgrounds/'+ data.pages[0].background;

  updateLunchMenu('entree', data.lunch.monday.entree);
  updateLunchMenu('main', data.lunch.monday.main);
  updateLunchMenu('side', data.lunch.monday.side);
  updateLunchMenu('dessert', data.lunch.monday.dessert);

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
setInterval(updateTime, 1000); // Update time every second
updateTime();

setInterval(fetchData, 30000); // Every 10 seconds like a ✨ninja✨
fetchData();

setInterval(() => {
  location.reload();
}, 10000); // Reload the page every 10 seconds