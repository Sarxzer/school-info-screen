async function fetchData() {
  const res = await fetch('/api/data');
  const data = await res.json();

  document.getElementById('background').src = './src/img/backgrounds/'+ data.pages[0].background;

  document.getElementById('entree').textContent = data.lunch.monday.entree.join(' ou ');
  document.getElementById('main').textContent = data.lunch.monday.main.join(' ou ');
  document.getElementById('side').textContent = data.lunch.monday.side.join(' ou ');
  document.getElementById('dessert').textContent = data.lunch.monday.dessert.join(' ou ');
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

setInterval(fetchData, 10000); // Every 10 seconds like a ✨ninja✨
fetchData();
