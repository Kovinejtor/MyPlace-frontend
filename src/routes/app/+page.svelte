<script lang="ts">
    import {Input} from 'flowbite-svelte';
    import {HomeSolid, CalendarMonthSolid, UsersSolid } from 'flowbite-svelte-icons';
    import { onMount } from 'svelte';
    import { app, storage } from '../../firebase';
  </script>
  
  <div class="pt-10 pb-10" style="margin-top: 100px;">
    <div class="grid grid-cols-10 gap-3 mt-1 p-3 bg-berkeley-blue rounded">
      <div class="col-start-2 col-span-2">
        <Input id="email" type="email" placeholder="Search by city or country">
          <HomeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Input>
      </div>
      
      <div class="col-start-5 col-span-2">
        <Input id="email" type="email" placeholder="Starting and final day of stay">
          <CalendarMonthSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Input>
      </div>
      
      <div class="col-start-8 col-span-2">
        <Input id="email" type="email" placeholder="Number of people and rooms">
          <UsersSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Input>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-4 mt-14 p-6 bg-berkeley-blue rounded">
      <div class="col-span-4 ml-10">
        <h1 class="text-2xl text-white">Type of place</h1>
      </div>
      
      <div class="relative flex items-center justify-center">
        <img src="/apartments.jpg" class="w-72 h-48 rounded-lg" alt="product 1"/>
        <p class="absolute top-3 left-12 text-white font-bold text-2xl" style="-webkit-text-stroke: 1px gray;">Apartments</p>
      </div>

      <div class="relative flex items-center justify-center">
        <img src="/hotels.jpg" class="w-72 h-48 rounded-lg" alt="product 1"/>
        <p class="absolute top-3 left-12 text-white font-bold text-2xl" style="-webkit-text-stroke: 1px gray;">Hotels</p>
      </div>

      <div class="relative flex items-center justify-center">
        <img src="/villas.jpeg" class="w-72 h-48 rounded-lg" alt="product 1"/>
        <p class="absolute top-3 left-12 text-white font-bold text-2xl" style="-webkit-text-stroke: 1px gray;">Villas</p>
      </div>

      <div class="relative flex items-center justify-center">
        <img src="/resorts.jpeg" class="w-72 h-48 rounded-lg" alt="product 1"/>
        <p class="absolute top-3 left-12 text-white font-bold text-2xl" style="-webkit-text-stroke: 1px gray;">Resorts</p>
      </div>

      <div class="relative flex items-center justify-center">
        <img src="/hostels.jpg" class="w-72 h-48 rounded-lg" alt="product 1"/>
        <p class="absolute top-3 left-12 text-white font-bold text-2xl" style="-webkit-text-stroke: 1px gray;">Hostels</p>
      </div>

      <div class="relative flex items-center justify-center">
        <img src="/motels.jpeg" class="w-72 h-48 rounded-lg" alt="product 1"/>
        <p class="absolute top-3 left-12 text-white font-bold text-2xl" style="-webkit-text-stroke: 1px gray;">Motels</p>
      </div>

      <div class="relative flex items-center justify-center">
        <img src="/cabins.jpeg" class="w-72 h-48 rounded-lg" alt="product 1"/>
        <p class="absolute top-3 left-12 text-white font-bold text-2xl" style="-webkit-text-stroke: 1px gray;">Cabins</p>
      </div>

      <div class="relative flex items-center justify-center">
        <img src="/cottages.jpg" class="w-72 h-48 rounded-lg" alt="product 1"/>
        <p class="absolute top-3 left-12 text-white font-bold text-2xl" style="-webkit-text-stroke: 1px gray;">Cottages</p>
      </div>
    </div>
  </div>
  
  

 
  
  
  
    
  
  