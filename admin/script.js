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
            console.warn(`Bruh 💀: No input found with id ${inputId}`);
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

        // Only update the fields that were modified
        lunch.entree = getUpdatedValues(day + '-entree', lunch.entree);
        lunch.main = getUpdatedValues(day + '-main', lunch.main);
        lunch.side = getUpdatedValues(day + '-side', lunch.side);
        lunch.dessert = getUpdatedValues(day + '-dessert', lunch.dessert);
    });

    // Post the updated data back to the server (without replacing the whole database!)
    const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(result);
    
}

// Helper function to get the updated values from inputs
function getUpdatedValues(inputIdPrefix, currentValues) {
    const updatedValues = [];

    currentValues.forEach((_, index) => {
        const inputId = `${inputIdPrefix}${index+1}`;
        const input = document.getElementById(inputId);

        if (input && input.value.trim()) { // Only update if the input has a value
            updatedValues.push(input.value.trim());
        }
    });

    return updatedValues.length > 0 ? updatedValues : currentValues; // Don't overwrite if empty
}

fetchDataAndFillInputs();
document.getElementById('save-button').addEventListener('click', async () => {
    await updateDatabase();
    alert("Data saved successfully! ✨");
});