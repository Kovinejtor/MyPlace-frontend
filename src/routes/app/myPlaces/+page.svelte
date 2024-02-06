<script lang="ts">
    import {Card, Button, Modal} from 'flowbite-svelte';
    import { onMount, afterUpdate, createEventDispatcher  } from 'svelte';
    import { app, storage } from '../../../firebase';
    import { getStorage, ref, uploadBytes, getDownloadURL, listAll, getMetadata} from 'firebase/storage';
    import { writable } from 'svelte/store';
    

    let count : number;
    
    let items: { id: number; name: string; tags: string[]; imageSrc: string; }[] = [];
    const imagesLoaded = writable(false);

    let defaultModal: boolean = false;

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
    tags: string[]; 
}
    let places: Place[] = [];

    onMount(() => {
        check();
        
    });

    let userEmail : string = "";
    

    async function check() {
        const accessTokenString = sessionStorage.getItem('accessToken');
        
        if (accessTokenString) {
        const accessToken = JSON.parse(accessTokenString);
        const access_token = accessToken?.access_token;

        try {
            const response = await fetch('http://127.0.0.1:8000/protected-route/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            });

            if (response.ok) {
                const result = await response.json();
                userEmail = result;
                console.log('Email of the current user:', userEmail);
                getCountOfPlaces();
                
            } else {
            console.error('Failed to fetch user information:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user information:', error);
        }
        } else {
        console.error('Access token not found in sessionStorage.');
        }
  }

  async function getCountOfPlaces() {
        try {
            const response = await fetch(`http://127.0.0.1:8000/count-places/?user_email=${userEmail}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                const result = await response.json();
                count = result.count;
                
                console.log('Number of places for current user:', count);
                getAllPlacesForCurrentUser();
            } else {
                console.error('Failed to fetch count of places:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching count of places:', error);
        }
    }

    async function getAllPlacesForCurrentUser() {
        try {
            const response = await fetch(`http://127.0.0.1:8000/places/?user_email=${userEmail}`, {
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
                //console.log('All places for current user:', places);
                retrieveFirstImages();
            } else {
                console.error('Failed to fetch places for current user:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching places for current user:', error);
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

async function retrieveFirstImages() {
    try {
        const promises = places.map(async (place) => {
            const imageUrl = await getFirstImage(place.folder);
            if (imageUrl) {
                place.image = imageUrl;
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

const dispatch = createEventDispatcher();
  let isOpen = false;

  let selectedPlace: Place | null = null;

  function openDialog(place: Place) {
  isOpen = true;
  selectedPlace = place;
}

  function closeDialog() {
    isOpen = false;
  }
</script>


<div class="grid grid-cols-3 flex justify-center items-center p-14 mt-14">
    <div class="flex col-span-3  justify-center items-center">
        <Card class="bg-berkeley-blue text-white">
            {#if count === 0}
                <p>You currently don't have any of your own places in the catalog that other people can rent.</p>
            {:else if count === 1}
                <p>You have {count} place in the catalog that others can rent.</p>
            {:else}
                <p>You have {count} places in the catalog that others can rent.</p>
            {/if}
            <div class="items-center text-center">
                <Button href="/app/myPlaces/addingPlace" color="blue" class="mt-6 w-56">Add place</Button>
            </div>
        </Card>
    </div>
    <div class="flex col-span-3 grid grid-cols-4 gap-16 justify-center items-center mt-20 bg-berkeley-blue text-white rounded p-14">
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
    </div>
    

    {#if isOpen}
  {#if selectedPlace}
    <div class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-berkeley-blue px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="leading-6 font-bold text-4xl text-white">{selectedPlace.name}</h3>
                <div class="mt-10 ml-14 grid grid-cols-2 gap-8 justify-center flexs items-center">
                  <p class="text-sm text-gray-500">
                    Type: {selectedPlace.type}
                  </p>
                  <p class="text-sm text-gray-500">
                    Country: {selectedPlace.country}
                  </p>
                  <p class="text-sm text-gray-500">
                    City: {selectedPlace.city}
                  </p>
                  <p class="text-sm text-gray-500">
                    Address: {selectedPlace.adress}
                  </p>
                  
                </div>
              </div>
            </div>
          </div>

          <div class="bg-berkeley-blue px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm" on:click={closeDialog}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
{/if}
</div>

