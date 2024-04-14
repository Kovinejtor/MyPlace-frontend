<script lang="ts">
    import { onMount } from 'svelte';
    import {Card, Button, Input, Search} from 'flowbite-svelte';
    import { writable } from 'svelte/store';
    import { storage } from '../../../firebase';
    import { ref, getDownloadURL, listAll, getMetadata} from 'firebase/storage';

    let emailGuest: string;
    let justOnce = true;

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
        reservation: string;
        }

        
    let places: Place[] = [];

    const beforeToday: Place[] = [];
    const afterToday: Place[] = [];

    const imagesLoaded = writable(false);

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    onMount(() => {
        check();
    });


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
            console.log('Email of the current user:', result);
            emailGuest = result;
            console.log(emailGuest);
            getReservedPlaces(emailGuest);
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

  async function getReservedPlaces(userEmail: string) {
    try {
        const url = `http://127.0.0.1:8000/places/reserved/?user_email=${encodeURIComponent(userEmail)}`;
        const response = await fetch(url);

        if (!response.ok) {
        throw new Error(`Failed to fetch reserved places: ${response.statusText}`);
        }

        places = await response.json();
        places = places.map((place: Place) => ({
            ...place,
            tags: [place.type, place.country, place.city]
        }));
        retrieveFirstImages();
        console.log("Places:",places);
        //return places;
    } catch (error) {
        console.error('Error fetching reserved places:', error);
        return []; 
    }
}

async function retrieveFirstImages() {
    try {
        const promises = places.map(async (place) => {
            const imageUrl = await getFirstImage(place.folder);
            if (imageUrl) {
                place.image = imageUrl;
                if(justOnce == true){
                    justOnce = false;
                    filterPlaces();
                }
                
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

function filterPlaces(){

    places.forEach(place => {
        const reservations = place.reservation.split(",");
        reservations.forEach(reservation => {
            const [email, , , endDateStr] = reservation.trim().split(" ");
            if (endDateStr) { // Check if endDateStr is defined
                const [dd, mm, yyyy] = endDateStr.split("-").map(Number); // Parse date components as numbers
                const endDate = new Date(yyyy, mm - 1, dd); // Month is 0-indexed in JavaScript Date
                if (email === emailGuest && endDate <= currentDate) {
                    beforeToday.push(place);
                } else if (email === emailGuest && endDate > currentDate) {
                    afterToday.push(place);
                }
            }
        });
    });

    console.log("BT:",beforeToday);
    console.log("AT:",afterToday);
    }
</script>

<div id="mainDiv" class="flex justify-center items-center grid grid-flow-row auto-rows-max gap-14 mt-[80px]">
    {#if $imagesLoaded && beforeToday.length !== 0}
        <Card class="grid grid-cols-3 gap-4 bg-berkeley-blue max-w-6xl text-white shadow-2xl drop-shadow-lg border-2 border-sky-600 mt-16 mb-24">
            
                {#each beforeToday as place (place.id)}
                    <div class="max-w-sm rounded overflow-hidden shadow-lg hover:outline">
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
            
        </Card>
    {/if} 
    {#if $imagesLoaded && afterToday.length !== 0}
        <Card class="grid grid-cols-3 gap-4 bg-berkeley-blue max-w-6xl text-white shadow-2xl drop-shadow-lg border-2 border-sky-600 mb-28">
            
                {#each afterToday as place (place.id)}
                    <div class="max-w-sm rounded overflow-hidden shadow-lg hover:outline">
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
            
        </Card>
    {/if} 
</div>
