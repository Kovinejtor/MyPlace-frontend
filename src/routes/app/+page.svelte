<script>
    import { onMount } from 'svelte';
    import { Button } from 'flowbite-svelte';
    import { page } from '$app/stores';
    import { Navbar, Card, NavBrand, NavLi, NavUl, NavHamburger, ImagePlaceholder, Skeleton, TextPlaceholder } from 'flowbite-svelte';
  
  
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
  
  <div>
    <h1 style="margin-top: 100px;" class="text-2xl text-white ml-14">Type of place</h1>
    <div class="flex flex-wrap justify-center">
      <div class="relative max-w-[200px] max-h-[155px] mt-4 mr-4">
        <img src="/src/lib/assets/apartments.jpg" class="w-full h-full rounded-lg" alt="product 1"/>
        <div class="absolute top-0 left-0 p-2 text-xl font-bold text-yale">
          Apartments
        </div>
      </div>
      <div class="relative max-w-[200px] max-h-[155px] mt-4 mr-4">
        <img src="/src/lib/assets/hotels.jpg" class="w-full h-full rounded-lg" alt="product 1"/>
        <div class="absolute top-0 left-0 p-2 text-xl font-bold text-yale">
          Hotels
        </div>
      </div>
      <div class="relative max-w-[200px] max-h-[155px] mt-4 mr-4">
        <img src="/src/lib/assets/villas.jpeg" class="w-full h-full rounded-lg" alt="product 1"/>
        <div class="absolute top-0 left-0 p-2 text-xl font-bold text-yale">
          Villas
        </div>
      </div>
      <div class="relative max-w-[200px] max-h-[155px] mt-4 mr-4">
        <img src="/src/lib/assets/resorts.jpeg" class="w-full h-full rounded-lg" alt="product 1"/>
        <div class="absolute top-0 left-0 p-2 text-xl font-bold text-yale">
          Resorts
        </div>
      </div>
      <div class="relative max-w-[200px] max-h-[155px] mt-4 mr-4">
        <img src="/src/lib/assets/hostels.jpg" class="w-full h-full rounded-lg" alt="product 1"/>
        <div class="absolute top-0 left-0 p-2 text-xl font-bold text-yale">
          Hostels
        </div>
      </div>
      <div class="relative max-w-[200px] max-h-[155px] mt-4 mr-4">
        <img src="/src/lib/assets/motels.jpeg" class="w-full h-full rounded-lg" alt="product 1"/>
        <div class="absolute top-0 left-0 p-2 text-xl font-bold text-yale">
          Motels
        </div>
      </div>
      <div class="relative max-w-[200px] max-h-[155px] mt-4 mr-4">
        <img src="/src/lib/assets/cabins.jpeg" class="w-full h-full rounded-lg" alt="product 1"/>
        <div class="absolute top-0 left-0 p-2 text-xl font-bold text-yale">
          Cabins
        </div>
      </div>
      <div class="relative max-w-[200px] max-h-[155px] mt-4 mr-4">
        <img src="/src/lib/assets/cottages.jpg" class="w-full h-full rounded-lg" alt="product 1"/>
        <div class="absolute top-0 left-0 p-2 text-xl font-bold text-yale">
          Cottages
        </div>
      </div>
      
    </div>
  </div>
  

  <div class="flex flex-wrap">
    <Card style="margin-top: 100px;" class="m-4">
      Nes
    </Card>
    <Card style="margin-top: 100px;" class="m-4">
      Nes
    </Card>
    <Card style="margin-top: 100px;" class="m-4">
      Nes
    </Card>
    <Card style="margin-top: 100px;" class="m-4">
      Nes
    </Card>
    <Card style="margin-top: 100px;" class="m-4">
      Nes
    </Card>
    <Card style="margin-top: 100px;" class="m-4">
      Nes
    </Card>
    <Card style="margin-top: 100px;" class="m-4">
      Nes
    </Card>
    <Card style="margin-top: 100px;" class="m-4">
      Nes
    </Card>
    <Card style="margin-top: 100px;" class="m-4">
      Nes
    </Card>
    <Card style="margin-top: 100px;" class="m-4">
      Nes
    </Card>
    <Card style="margin-top: 100px;" class="m-4">
      Nes
    </Card>
    <Card style="margin-top: 100px;" class="m-4">
      Nes
    </Card>
    <Card style="margin-top: 100px;" class="m-4">
      Nes
    </Card>
    <Card style="margin-top: 100px;" class="m-4">
      Nes
    </Card>
    <Card style="margin-top: 100px;" class="m-4">
      Nes
    </Card>
    <Card style="margin-top: 100px;" class="m-4">
      Nes
    </Card>
    <Card style="margin-top: 100px;" class="m-4">
      Nes
    </Card>
    <Card style="margin-top: 100px;" class="m-4">
      Nes
    </Card>
  </div>
  

 
  
  
  
    
  
  