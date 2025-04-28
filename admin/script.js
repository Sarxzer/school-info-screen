async function fetchData() {
    const res = await fetch('/api/data');
    const data = await res.json();
}

async function modifyAndPostData(modifier) {
    const res = await fetch('/api/data');
    let data = await res.json();

    // Modify the data using the provided modifier function
    data = modifier(data);

    // Post the modified data back to the server
    await fetch('/api/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
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