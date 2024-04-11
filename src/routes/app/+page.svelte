<script lang="ts">
    import {Input, Card, Button, Label, Select, Textarea} from 'flowbite-svelte';
    import {HomeSolid, CalendarMonthSolid, UsersSolid } from 'flowbite-svelte-icons';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { app, storage } from '../../firebase';
    import { getStorage, ref, uploadBytes, getDownloadURL, listAll, getMetadata, deleteObject} from 'firebase/storage';

  interface Place {
    id: number;
    type: string;
    name: string;
    adress: string;
    adults: number;
    animals: string;
    authorEmail: string;
    beds: number;
    children: number;
    city: string;
    country: string;
    dates: string;
    description: string;
    folder: string;
    maxPeople: number;
    minNight: number;
    parking: string;
    price: string;
    image?: string;
    images: string[];
    tags: string[]; 
    dateRange: string;
}

let places: Place[] = [];

let selectedPlace: Place | null = null;
let showImage:boolean = false;

const imagesLoaded = writable(false);
let isOpen = false;

  onMount(() => {

    getAllPlacesForCurrentUser();
    
   
  });

async function getAllPlacesForCurrentUser() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/places`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
          const result: Place[] = await response.json();
        places = result.map((place: Place) => ({
            ...place,
            tags: [place.type, place.country, place.city]
        }));
            console.log('All places:', places);
            retrieveFirstImages();
        } else {
            console.error('Failed to fetch places:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching places:', error);
    }
}

async function retrieveFirstImages() {
    try {
        const promises = places.map(async (place) => {
            const imageUrl = await getFirstImage(place.folder);
            if (imageUrl) {
                place.image = imageUrl;
                console.log("Slike", place.image);
            } else {
                console.log(`No image found for ${place.name}`);
            }
        });

        await Promise.all(promises);
        imagesLoaded.set(true);
    } catch (error) {
        console.error('Error retrieving images:', error);
    }
}

async function getFirstImage(folderName: string): Promise<string | null> {
    try {
        const folderRef = ref(storage, `images/${folderName}`);
        const items = await listAll(folderRef);

        for (const item of items.items) {
            const metadata = await getMetadata(item);

            if (metadata.contentType && metadata.contentType.startsWith('image/')) {
                return await getDownloadURL(item);
            }
        }

        return null;
    } catch (error) {
        console.error('Error fetching first image from folder:', error);
        return null;
    }
}

const getImagesForOpenedDialog = async () => {
    if (!selectedPlace || !selectedPlace.folder) {
        console.error("Selected place or folder is not available.");
        return;
    }

    const folderName = selectedPlace.folder;
    const folderPath = `images/${folderName}`;
    const folderRef = ref(storage, folderPath); 

    try {
        const imageRefs = await listAll(folderRef); 
        const imageURLs: string[] = [];

        for (const imageRef of imageRefs.items) {
            const imageURL = await getDownloadURL(imageRef); 
            imageURLs.push(imageURL);
        }

        showImage = true;
        selectedPlace.images = imageURLs;
        console.log("Retrieved images:", imageURLs);
    } catch (error) {
        console.error("Error retrieving images:", error);
    }
};

async function openDialog(place: Place) {
    const mainDiv = document.getElementById('mainDiv');
    if (mainDiv) {
        mainDiv.classList.add('blur-lg');
    }

    const mainCard = document.getElementById('mainCard');
    if (mainCard) {
        mainCard.classList.add('h-screen');
    }

    //parseDatesAndPrices(place);
    isOpen = true;
    
    selectedPlace = place;
    console.log("Selected: ", selectedPlace);
    await getImagesForOpenedDialog();
    //renderDialog();
    /*
    setTimeout(() => {
    for (let i = 0; i < datePricePairs.length; i++) {
        initializeFlatpickr('#datepicker-' + i, i);
    }
}, 0);
   */
}

function closeDialog() {
    const mainDiv = document.getElementById('mainDiv');
    if (mainDiv) {
        mainDiv.classList.remove('blur-lg');
    }
    isOpen = false;
    showImage = false;
  }

  let currentIndex = 0;

function goToPrev() {
  if (selectedPlace?.images) {
    currentIndex = (currentIndex - 1 + selectedPlace.images.length) % selectedPlace.images.length;
  }
}

function goToNext() {
  if (selectedPlace?.images) {
    currentIndex = (currentIndex + 1) % selectedPlace.images.length;
  }
}
</script>
 
<div id="mainDiv" class="flex justify-center items-center grid grid-flow-row auto-rows-max gap-14">
  <Card class="mt-64 grid grid-cols-4 gap-6 bg-berkeley-blue max-w-6xl text-white shadow-2xl drop-shadow-lg border-2 border-sky-600 text-center">
    <div class="relative group" >
      <img src="/apartments.jpg" class="rounded-lg h-48 w-64 hover:outline" alt="product 1"/>
      <p class="absolute top-0 left-0 bg-berkeley-blue text-white px-2 py-1 rounded-tr-lg border-white border-2">Apartments</p>
    </div>
    <div class="relative group">
        <img src="/hotels.jpg" class="rounded-lg h-48 w-64 hover:outline" alt="product 1"/>
        <p class="absolute top-0 left-0 bg-berkeley-blue text-white px-2 py-1 rounded-tr-lg border-white border-2">Hotels</p>
    </div>
    <div class="relative group">
        <img src="/hostels.jpg" class="rounded-lg h-48 w-64 hover:outline" alt="product 1"/>
        <p class="absolute top-0 left-0 bg-berkeley-blue text-white px-2 py-1 rounded-tr-lg border-white border-2">Hostels</p>
    </div>
    <div class="relative group">
        <img src="/motels.jpeg" class="rounded-lg h-48 w-64 hover:outline" alt="product 1"/>
        <p class="absolute top-0 left-0 bg-berkeley-blue text-white px-2 py-1 rounded-tr-lg border-white border-2">Motels</p>
    </div>
    <div class="relative group">
        <img src="/villas.jpeg" class="rounded-lg h-48 w-64 hover:outline" alt="product 1"/>
        <p class="absolute top-0 left-0 bg-berkeley-blue text-white px-2 py-1 rounded-tr-lg border-white border-2">Villas</p>
    </div>
    <div class="relative group">
        <img src="/cabins.jpeg" class="rounded-lg h-48 w-64 hover:outline" alt="product 1"/>
        <p class="absolute top-0 left-0 bg-berkeley-blue text-white px-2 py-1 rounded-tr-lg border-white border-2">Cabins</p>
    </div>
    <div class="relative group">
        <img src="/resorts.jpeg" class="rounded-lg h-48 w-64 hover:outline" alt="product 1"/>
        <p class="absolute top-0 left-0 bg-berkeley-blue text-white px-2 py-1 rounded-tr-lg border-white border-2">Resorts</p>
    </div>
    <div class="relative group">
        <img src="/cottages.jpg" class="rounded-lg h-48 w-64 hover:outline" alt="product 1"/>
        <p class="absolute top-0 left-0 bg-berkeley-blue text-white px-2 py-1 rounded-tr-lg border-white border-2">Cottages</p>
    </div>
  </Card>

  <Card class="grid grid-cols-3 gap-4 bg-berkeley-blue max-w-6xl text-white shadow-2xl drop-shadow-lg border-2 border-sky-600 mt-16 mb-28">
    {#if $imagesLoaded}
      {#each places as place (place.id)}
            <div on:click={() => openDialog(place)} role="button" tabindex="0" on:keydown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                openDialog(place);} }} class="max-w-sm rounded overflow-hidden shadow-lg hover:outline">
                <img class="w-full h-48" src={place.image} alt="">
                <div class="px-6 py-4">
                    <div class="font-bold text-xl mb-2">{place.name}</div>
                </div>
                <div class="px-6 pt-4 pb-2">
                  {#each place.tags as tag}
                      <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{tag}</span>
                  {/each}
              </div>
            </div>
          {/each}
      {/if}
  </Card>
</div>



{#if isOpen}
  {#if selectedPlace}
        <div class="absolute inset-0 flex justify-center items-center">
            <Card class="mt-[1300px] md:mt-[1000px] lg:mt-[1000px] grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 md:gap-4 lg:gap-4 bg-berkeley-blue max-w-2xl text-white shadow-2xl drop-shadow-lg border-2 border-sky-600">
              <h1 class="text-3xl font-bold text-center md:col-span-2 lg:col-span-2">{selectedPlace.type} {selectedPlace.name}</h1>

              <p class="text-center mt-8">Country: {selectedPlace.country}</p>
              <p class="text-center mt-8">City: {selectedPlace.city}</p>
              <p class="text-center mt-8">Adress: {selectedPlace.adress}</p>
              
              <p class="text-center mt-8">Maximum number of people: {selectedPlace.maxPeople}</p>
              <p class="text-center mt-8">Number of beds: {selectedPlace.beds}</p>
              <p class="text-center mt-8">Number of adults: {selectedPlace.adults}</p>
              

              <p class="text-center mt-8">Number of children: {selectedPlace.children}</p>
              <p class="text-center mt-8">Are animals allowed?: {selectedPlace.animals}</p>
              <p class="text-center mt-8">Is there a parking?: {selectedPlace.parking}</p>

              <p class="text-center mt-8">Minimum nights per reservation: {selectedPlace.minNight}</p>
              <Textarea class="col-span-2" bind:value={selectedPlace.description}/>

              {#if showImage}
                <div class="relative col-span-2">
                  <img src={selectedPlace.images[currentIndex]} class="w-[1200px] h-96" alt="">
                  <button on:click={goToPrev} class="absolute top-1/2 left-4 transform -translate-y-1/2 w-12 h-12 bg-gray-200 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
                    &lt;
                  </button>
                  <button on:click={goToNext} class="absolute top-1/2 right-4 transform -translate-y-1/2 w-12 h-12 bg-gray-200 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
                    &gt;
                  </button>
                </div>
              {/if}
              <Button>
                Reserve
              </Button>

              <Button color="blue" on:click={closeDialog}>
                Close
              </Button>
            </Card>
        </div>
  {/if}
{/if}

 
  
  
  
    
  
  