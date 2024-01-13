<script>
    import { onMount } from 'svelte';
    import { Button } from 'flowbite-svelte';
    import { page } from '$app/stores';
    import { Navbar, Card, NavBrand, NavLi, NavUl, NavHamburger, ImagePlaceholder, Skeleton, TextPlaceholder } from 'flowbite-svelte';
    import { Label, Input, ButtonGroup } from 'flowbite-svelte';
    import { EnvelopeSolid, HomeSolid, CalendarMonthSolid, UsersSolid } from 'flowbite-svelte-icons';
  
  
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
    <div class="flex justify-center items-center">
      <div style="margin-top: 100px;" class="m-2">
        <Input id="email" type="email" placeholder="Search by city or country" style="width: 234px;">
          <HomeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Input>
      </div>
      
      <div style="margin-top: 100px;" class="m-2">
        <Input id="email" type="email" placeholder="Starting and final day of stay" style="width: 234px;">
          <CalendarMonthSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Input>
      </div>
      
      <div style="margin-top: 100px;" class="m-2">
        <Input id="email" type="email" placeholder="Number of people and rooms" style="width: 234px;">
          <UsersSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Input>
      </div>
    </div>
    
    <div class="ml-14 mt-10 mb-4">
      <h1 class="text-2xl text-white">Type of place</h1>
    </div>
    <div class="flex flex-wrap justify-center">
      <div class="flex-none relative w-[200px] h-[155px] mt-4 mr-4">
        <img src="/src/lib/assets/apartments.jpg" class="w-full h-full rounded-lg" alt="product 1"/>
        <div class="absolute top-0 left-0 p-2 text-xl font-bold text-yale">
          Apartments
        </div>
      </div>
      <div class="flex-none relative w-[200px] h-[155px] mt-4 mr-4">
        <img src="/src/lib/assets/hotels.jpg" class="w-full h-full rounded-lg" alt="product 1"/>
        <div class="absolute top-0 left-0 p-2 text-xl font-bold text-yale">
          Hotels
        </div>
      </div>
      <div class="flex-none relative w-[200px] h-[155px] mt-4 mr-4">
        <img src="/src/lib/assets/villas.jpeg" class="w-full h-full rounded-lg" alt="product 1"/>
        <div class="absolute top-0 left-0 p-2 text-xl font-bold text-yale">
          Villas
        </div>
      </div>
      <div class="flex-none relative w-[200px] h-[155px] mt-4 mr-4">
        <img src="/src/lib/assets/resorts.jpeg" class="w-full h-full rounded-lg" alt="product 1"/>
        <div class="absolute top-0 left-0 p-2 text-xl font-bold text-yale">
          Resorts
        </div>
      </div>
      <div class="flex-none relative w-[200px] h-[155px] mt-4 mr-4">
        <img src="/src/lib/assets/hostels.jpg" class="w-full h-full rounded-lg" alt="product 1"/>
        <div class="absolute top-0 left-0 p-2 text-xl font-bold text-yale">
          Hostels
        </div>
      </div>
      <div class="flex-none relative w-[200px] h-[155px] mt-4 mr-4">
        <img src="/src/lib/assets/motels.jpeg" class="w-full h-full rounded-lg" alt="product 1"/>
        <div class="absolute top-0 left-0 p-2 text-xl font-bold text-yale">
          Motels
        </div>
      </div>
      <div class="flex-none relative w-[200px] h-[155px] mt-4 mr-4">
        <img src="/src/lib/assets/cabins.jpeg" class="w-full h-full rounded-lg" alt="product 1"/>
        <div class="absolute top-0 left-0 p-2 text-xl font-bold text-yale">
          Cabins
        </div>
      </div>
      <div class="flex-none relative w-[200px] h-[155px] mt-4 mr-4">
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
  

 
  
  
  
    
  
  