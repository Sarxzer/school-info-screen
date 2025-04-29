async function fetchDataAndFillInputs() {
    const res = await fetch('/api/data');
    const data = await res.json();

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    days.forEach(day => {
        const lunch = data.lunch[day];
        if (!lunch) {
            console.warn(`⚠️ No lunch data for ${day}! Skipping...`);
            return;
        }

        // Fix "side" vs "sides" nightmare 💀
        const side = lunch.side || lunch.sides || [];

        // Update inputs
        updateInput(day + '-entree', lunch.entree);
        updateInput(day + '-main', lunch.main);
        updateInput(day + '-side', side);
        updateInput(day + '-dessert', lunch.dessert);
    });
}

function updateInput(inputIdPrefix, items) {
    items = items || []; // Bro we need a backup if items is undefined 💀

    items.forEach((item, index) => {
        const inputId = `${inputIdPrefix}${index+1}`;
        const input = document.getElementById(inputId);

        if (input) {
            input.value = item;
        } else {
            console.warn(`No input found with id ${inputId}`);
        }
    });
}

async function updateDatabase() {
    const res = await fetch('/api/data');
    let data = await res.json();

    console.log(data);

    // Get updated values from the inputs
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    days.forEach(day => {
        const lunch = data.lunch[day];

        if (!lunch) {
            console.warn(`⚠️ No lunch data for ${day}! Skipping...`);
            return;
        }

        // Fix "side" vs "sides" inconsistency
        const sideKey = lunch.side ? 'side' : 'sides';
        lunch[sideKey] = getUpdatedValues(day + '-side', lunch[sideKey]);

        // Update other fields
        lunch.entree = getUpdatedValues(day + '-entree', lunch.entree);
        lunch.main = getUpdatedValues(day + '-main', lunch.main);
        lunch.dessert = getUpdatedValues(day + '-dessert', lunch.dessert);
    });

    console.log("Updated data:", data);
    console.log("Data being sent to the server:", data);

    // Post the updated data back to the server
    const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(result);
}

// Helper function to get the updated values from inputs
function getUpdatedValues(inputIdPrefix, currentValues) {
    const updatedValues = [];

    // Loop through the inputs and collect their values
    for (let i = 1; i <= 10; i++) { // Assuming a maximum of 10 inputs per field
        const inputId = `${inputIdPrefix}${i}`;
        const input = document.getElementById(inputId);

        if (input && input.value.trim()) {
            updatedValues.push(input.value.trim());
        }
    }

    return updatedValues.length > 0 ? updatedValues : currentValues;
}

fetchDataAndFillInputs();
document.getElementById('save-button').addEventListener('click', async () => {
    await updateDatabase();
    alert("Menu sauvegardé !");
    location.reload();
});

// Remove the old day selector logic
document.getElementById('day-selector')?.remove();

// Smooth scrolling for sidebar links
document.querySelectorAll('#sidebar a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

document.getElementById('category-selector').addEventListener('change', (event) => {
    const selectedCategory = event.target.value;

    if (!selectedCategory) return; // Do nothing if no category is selected

    // Scroll to the selected day or dish
    if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(selectedCategory)) {
        // Scroll to the day section
        const dayElement = document.getElementById(selectedCategory);
        if (dayElement) {
            dayElement.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        // Scroll to the first occurrence of the dish category
        const dishElement = document.querySelector(`.menu-element h4:contains(${selectedCategory})`);
        if (dishElement) {
            dishElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
});