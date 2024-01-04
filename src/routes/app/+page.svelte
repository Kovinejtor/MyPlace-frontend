<script>
    import { onMount } from 'svelte';
    import { Button } from 'flowbite-svelte';
    import { page } from '$app/stores';
  
  
    // Define the book data
    let bookData = {
      name: "",
      author: "",
      page_number: 0
    };
  
    // Function to send a POST request to the FastAPI endpoint
    const addBook = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/books/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookData),
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log('Book added successfully:', result);
        } else {
          console.error('Failed to add book:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding book:', error);
      }
    };
  
    // Function to handle form submission
    const handleSubmit = () => {
      addBook();
    };
  
    // Trigger the addBook function when the component is mounted (you can use other events or user interactions)
    onMount(() => {
      // Optional: You can perform any initial setup here
    });
  </script>
  
  
  
  
  <div class="mt-20 mb-8">
    <h1>SvelteKit Page</h1>
    
    <form on:submit|preventDefault={handleSubmit}>
      <label for="name">Name:</label>
      <input type="text" bind:value={bookData.name} id="name" required />
      
      <label for="author">Author:</label>
      <input type="text" bind:value={bookData.author} id="author" required />
      
      <label for="page_number">Page Number:</label>
      <input type="number" bind:value={bookData.page_number} id="page_number" required />
  
      <Button type="submit" color="blue">Add book</Button>
    </form>
  </div>
  
  
  
    
  
  