// Api.js
export async function fetchData() {
    const response = await fetch('http://127.0.0.1:8000/');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }
  