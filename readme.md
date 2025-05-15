Project Concept:

The main idea was to develop a website displayed in kiosk mode on a TV or monitor. It would provide students with key information such as absent teachers, the lunch menu, and school events. The screen would be placed in a high-traffic area. Initially, the plan included smooth animations to improve visual presentation.

The web server is built with Node.js using the Express framework, allowing dynamic data updates without reloading the page.

The project runs on an old computer using Debian 12.

The website is divided into two sections: the main public display and an administration/configuration page for staff to update information.

Challenges Encountered:

Due to limited hardware resources, the website had to be kept lightweight. A traditional database such as MariaDB or SQL was not suitable, so a JSON file is used to store and access data via a basic API.

Time constraints and working alone led to the removal of animations in favor of a simpler layout.

Fetching external data, such as weather updates, was complicated by the school’s proxy settings. Although the Open-Meteo API was chosen for its free access, client-side requests were blocked. A proxy was added to the API script using the "https-proxy-agent" and "dotenv" modules to securely manage proxy settings.

Project Implementation:

The main server logic is in server.js at the root of the project. It sets up the Express server and API routes. The API is accessible locally via the server IP, allowing the client to retrieve data without internet access. Weather data is fetched server-side to ensure availability offline.

The public display page is located in the /public directory. It includes index.html for structure, style.css for design, and script.js for API interactions to retrieve weather, absences, lunch menus, and events. It also shows the current date and time, which may need correction if the client’s clock is misconfigured.

The administration page is found in the /admin directory. It contains index.html for input forms, style.css for appearance, and script.js for submitting and retrieving data. Currently, the admin interface has no authentication and replaces the entire data.json file, which could present stability and security concerns.

Future Ideas:
11. To run the server in production mode, use:
```bash


Add password protection to the administration page

Implement automatic data backup

Develop a mobile version accessible via the school’s public Wi-Fi

Support image uploads for event announcements

What I Learned:

How to use Node.js with Express

How to build a simple API

How to work with the Open-Meteo API

System Overview:

Internet ← (fetch) Server ↔ (fetch/post) Admin Page

                          ← (fetch) Public Page


How to setup the project:
1. Clone the repository:
```bash
git clone https://github.com/sarxzer/School-Info-Screen.git
```
2. Navigate to the project directory:
```bash
cd School-Info-Screen
```
3. Install the required packages:
```bash
npm install
```
4. Create a `.env` file in the root directory, add your proxy settings (if needed), and set the Open-Meteo API URL:
```bash
PROXY_URL=http://username:password@your-proxy-url:port
WEATHER_API_URL=https://api.open-meteo.com/v1/forecast?latitude=YOUR_LATITUDE&longitude=YOUR_LONGITUDE&current_weather=true
```
5. Start the server:
```bash
npm start
```
6. Open your web browser and navigate to `http://localhost:3000` to view the public display page.
7. To access the administration page, navigate to `http://localhost:3000/admin`.
8. Use the admin interface to update the data.json file with new information.
9. The public display page will automatically refresh to show the latest data.
10. To stop the server, press `Ctrl + C` in the terminal where the server is running.

