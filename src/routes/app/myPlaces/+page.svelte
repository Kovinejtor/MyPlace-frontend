<script lang="ts">
    import {Card, Button, Label, Select, Textarea, Input} from 'flowbite-svelte';
    import { onMount, afterUpdate, createEventDispatcher  } from 'svelte';
    import { app, storage } from '../../../firebase';
    import { getStorage, ref, uploadBytes, getDownloadURL, listAll, getMetadata, deleteObject} from 'firebase/storage';
    import { writable } from 'svelte/store';
    import flatpickr from 'flatpickr';
    import 'flatpickr/dist/flatpickr.css';
    

    let count : number;
    let selectedDate: string = "";
    let items: { id: number; name: string; tags: string[]; imageSrc: string; }[] = [];
    const imagesLoaded = writable(false);
    let filteredReservations: string[] = [];

    const currentDate = new Date();


    let countries = [
        { value: 'Apartment', name: 'Apartment' },
        { value: 'Villa', name: 'Villa' },
        { value: 'Hotel', name: 'Hotel' },
        { value: 'Motel', name: 'Motel' },
        { value: 'Hostel', name: 'Hostel' },
        { value: 'Resort', name: 'Resort' },
        { value: 'Cabin', name: 'Cabin' },
        { value: 'Cottage', name: 'Cottage' }
    ];

    let animals = [
        { value: 'Yes', name: 'Yes' },
        { value: 'No', name: 'No' }
    ];

    let parking = [
        { value: 'Yes. It is free.', name: 'Yes. It is free.' },
        { value: 'Yes. You need to pay the parking.', name: 'Yes. You need to pay the parking.' },
        { value: 'No.', name: 'No.' },
    ];

    let textareaprops = {
        id: 'message',
        name: 'message',
        label: 'Your message',
        rows: 4,
        placeholder: 'Add a description for your place'
    };

   

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
    images: string[];
    tags: string[]; 
    dateRange: string;
    reservation: string;
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
                console.log('All places for current user:', places);
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

    parseDatesAndPrices(place);
    isOpen = true;
    
    selectedPlace = place;
    await getImagesForOpenedDialog();
    convertReservation();
    renderDialog();

    setTimeout(() => {
    for (let i = 0; i < datePricePairs.length; i++) {
        initializeFlatpickr('#datepicker-' + i, i);
    }
}, 0);
   
}

async function deleteImage(imageURL: string) {
    try {
        if (!selectedPlace) {
            console.error("Selected place is null.");
            return;
        }

        if (selectedPlace.images && selectedPlace.images.length <= 5) {
            console.error("Cannot delete image. Minimum of 5 images required.");
            return;
        }

        const imageRef = ref(storage, imageURL);

        await deleteObject(imageRef);

        console.log("Image deleted successfully:", imageURL);

        selectedPlace.images = selectedPlace.images?.filter(url => url !== imageURL) || [];

        renderDialog();
    } catch (error) {
        console.error("Error deleting image:", error);
    }
}


function renderDialog() {
    const imagesContainer = document.getElementById('images-container');
    if (imagesContainer && selectedPlace?.images) {
        imagesContainer.innerHTML = ''; 

        selectedPlace.images.forEach(imageURL => {
            const imageWrapper = document.createElement('div'); 
            imageWrapper.classList.add('relative'); 

            const img = document.createElement('img');
            img.src = imageURL;
            img.alt = 'Image';
            img.classList.add('w-full', 'h-48');
            imageWrapper.appendChild(img);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('absolute', 'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2', 'bg-white', 'text-gray-800', 'p-2', 'rounded-full', 'cursor-pointer', 'opacity-0', 'transition-opacity', 'duration-300');
            deleteButton.innerHTML = '🗑️';
            deleteButton.addEventListener('click', () => deleteImage(imageURL)); 
            imageWrapper.appendChild(deleteButton);

            imageWrapper.addEventListener('mouseenter', () => {
                deleteButton.classList.remove('opacity-0');
            });

            imageWrapper.addEventListener('mouseleave', () => {
                deleteButton.classList.add('opacity-0');
            });

            imagesContainer.appendChild(imageWrapper);
        });
    }
}

const flatpickrInstances: flatpickr.Instance[] = [];

const initializeFlatpickr = (selector: string, id: number) => {
    console.log("Initializing Flatpickr...");
    const flatpickrInstance = flatpickr(selector, {
        mode: "range",
        minDate: "today",
        dateFormat: 'd-m-Y',
        disable: addDisabled(id)
    });

    if (Array.isArray(flatpickrInstance)) {
        flatpickrInstances.push(flatpickrInstance[0]);
    } else {
        flatpickrInstances.push(flatpickrInstance);
    }
};

function updateDisabledRanges(){
    for (let i = 0; i < flatpickrInstances.length; i++) {
        const instance = flatpickrInstances[i];
        const id = parseInt(instance.input.id.replace('datepicker-', ''));
        instance.set("disable", addDisabled(id));
    }
}

function addDisabled(id: number){
    console.log("ALL", datePricePairs);
    console.log(datePricePairs[1]?.dateRange);  //undefined -> TODO: check undefined
    const disabledRanges = datePricePairs
        .filter((pair, index) => index !== id) 
        .map(pair => {
            //console.log("PAIR", pair);
            const dates = pair.dateRange.split(" to ");
            //console.log("DATES", dates);
            const from = dates[0].trim();
            //console.log("FROM", from);
            const to = dates.length > 1 ? dates[1].trim() : from; 
            //console.log("TO", to);
            return { from, to };
        });
    //console.log("DISABLED", [...disabledRanges]);
    return [...disabledRanges]; 
}


  function closeDialog() {
    const mainDiv = document.getElementById('mainDiv');
    if (mainDiv) {
        mainDiv.classList.remove('blur-lg');
    }

    const mainCard = document.getElementById('mainCard');
    if (mainCard) {
        mainCard.classList.remove('h-screen');
    }

    isOpen = false;
    console.log(datePricePairs);
    datePricePairs = [];
    allDateRanges = [];
    
  }

  async function changeData() {
    try {
        if (!selectedPlace) {
            console.error('selectedPlace is null');
            return;
        }
        console.log(datePricePairs);
        const datesAll = datePricePairs
              .map(pair => `${pair.dateRange} for ${pair.price}€`)
              .join(',')
              .trim() 
              .replace(/\s{2,}/g, ' '); 

        console.log(datesAll);
        selectedPlace.dates = datesAll;
        const response = await fetch(`http://127.0.0.1:8000/places/${selectedPlace.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const existingPlace = await response.json();
            
            const keysToIgnore = ['folder', 'image']; 
            let hasChanges = false;
            for (const key in selectedPlace) {
                if (!keysToIgnore.includes(key) && selectedPlace[key as keyof Place] !== existingPlace[key as keyof Place]) {
                    existingPlace[key as keyof Place] = selectedPlace[key as keyof Place];
                    hasChanges = true;
                }
            }

            if (hasChanges) {
                const updateResponse = await fetch(`http://127.0.0.1:8000/places/${selectedPlace.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(existingPlace)
                });

                if (updateResponse.ok) {
                    console.log('Place updated successfully');
                } else {
                    console.error('Failed to update place:', updateResponse.statusText);
                }
            } else {
                console.log('No changes detected');
            }
        } else {
            console.error('Failed to fetch existing place:', response.statusText);
        }
    } catch (error) {
        console.error('Error updating place:', error);
    }
}

let datePricePairs: { dateRange: string, price: string }[] = [];
let allDateRanges: string[] = [];

function parseDatesAndPrices(place: Place) {
    const datePriceStrings = place.dates.split(',');

    for (const datePriceString of datePriceStrings) {
        const [dateRange, priceString] = datePriceString.split('for');

        const price = priceString.trim().replace('€', '');
        datePricePairs.push({ dateRange, price });
    }
    allDateRanges = datePricePairs.map(pair => pair.dateRange);
    //console.log("ovo", allDateRanges);
    
}

function openFileInput() {
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    fileInput?.click();
}

async function handleImageUpload(event: { currentTarget: HTMLInputElement }) {
    const fileInput = event.currentTarget;
    
    if (!fileInput) {
        return;
    }

    const files = fileInput.files;

    if (!files || files.length === 0) {
        return;
    }

    const uploadPromises = [];

    for (const file of files) {
        const storageRef = ref(storage, `images/${selectedPlace?.folder}/${file.name}`);
        const uploadTask = uploadBytes(storageRef, file);
        uploadPromises.push(uploadTask);
    }

    try {
        await Promise.all(uploadPromises);
        console.log("Images uploaded successfully.");

        // Refresh the list of images
        await getImagesForOpenedDialog();
        renderDialog();
    } catch (error) {
        console.error("Error uploading images:", error);
    }
}

async function deletePlace(placeId: number, folderName: string): Promise<void> {
  try {
    
    const storageRef = ref(storage, `images/${folderName}`);
    const filesList = await listAll(storageRef);
    await Promise.all(filesList.items.map(item => deleteObject(item)));

    const url = `http://127.0.0.1:8000/deletePlace/${placeId}`;
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to delete place: ${errorMessage}`);
    }

    console.log('Place deleted successfully');
  } catch (error) {
    console.error('Error deleting place:', error);
  }
}

function convertReservation() {
    console.log("CURDATE",currentDate);
    // Check if selectedPlace exists and has a reservation property
    if (selectedPlace && selectedPlace.reservation) {
        let reservationString = selectedPlace.reservation.trim();
        
        // Trim the trailing comma if it exists
        if (reservationString.endsWith(',')) {
            reservationString = reservationString.slice(0, -1);
        }

        // Split the string by comma and trim any extra whitespace
        const reservations = reservationString.split(',').map(reservation => reservation.trim());

        // Format each reservation string
        const formattedReservations = reservations.map(reservation => {
            const [email, price, startDate, endDate] = reservation.split(' ');
            return ` - ${email} for ${price} from ${startDate} to ${endDate}`;
        });

        console.log(formattedReservations);

        filteredReservations = formattedReservations.filter(reservation => {
            
            const endDateString = reservation.split(' to ')[1];
            console.log("End Date String:", endDateString); 
            
            const [dayStr, monthStr, yearStr] = endDateString.split('-');
            const day = parseInt(dayStr, 10);
            const month = parseInt(monthStr, 10) - 1; 
            const year = parseInt(yearStr, 10);
            
            const endDate = new Date(year, month, day);
            
            console.log("End Date:", endDate);
            
            return endDate > currentDate;
        });

        console.log("FILTERED:",filteredReservations);
    } else {
        console.log("selectedPlace or selectedPlace.reservation is null or undefined.");
    }
}


</script>


<div id="mainDiv" class="flex justify-center items-center grid grid-flow-row auto-rows-max gap-14">
    <Card id="mainCard"class="bg-berkeley-blue max-w-2xl text-white shadow-2xl drop-shadow-lg border-2 border-sky-600 mt-28 text-center">
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
    
    <div>
     {#if count!=0}
      <Card class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-2xl bg-berkeley-blue text-white shadow-2xl drop-shadow-lg border-2 border-sky-600 mb-16">
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
     {/if}
    </div>
</div>


{#if isOpen}
    {#if selectedPlace}
        <div class="absolute inset-0 flex justify-center items-center">
            <Card class="mt-[1300px] md:mt-[1200px] lg:mt-[1200px] grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 md:gap-4 lg:gap-4 bg-berkeley-blue max-w-2xl text-white shadow-2xl drop-shadow-lg border-2 border-sky-600">
                <h1 class="text-3xl font-bold text-center md:col-span-2 lg:col-span-2">{selectedPlace.type} {selectedPlace.name}</h1>

                <p class="md:col-span-2 lg:col-span-2 text-center mt-8">Reservations:</p>
                {#each filteredReservations as reservation}
                    <p class="md:col-span-2 lg:col-span-2 text-center">{reservation}</p>
                {/each}
                <p class="md:col-span-2 lg:col-span-2 text-center mt-8">Location: {selectedPlace.country}, {selectedPlace.city}, {selectedPlace.adress}</p>

                <div>
                    <Label class="text-white mb-1">Maximum number of people</Label>
                    <Input type="number" min="1" bind:value={selectedPlace.maxPeople}/>
                </div>

                <div>
                    <Label class="text-white mb-1">Number of beds</Label>
                    <Input type="number" min="1" bind:value={selectedPlace.beds}/>
                </div>
                <div>
                    <Label class="text-white mb-1">Number of adults</Label>
                    <Input type="number" min="1" bind:value={selectedPlace.adults}/>
                </div>
                <div>
                    <Label class="text-white mb-1">Number of children</Label>
                    <Input type="number" min="0" bind:value={selectedPlace.children}/>
                </div>

                <div>
                    <Label class="text-white mb-1">Are animals allowed?</Label>
                    <Select items={animals} bind:value={selectedPlace.animals} placeholder="Are animals allowed?"/>
                  </div>
                  <div>
                    <Label class="text-white mb-1">Is there a parking?</Label>
                    <Select items={parking} bind:value={selectedPlace.parking} placeholder="Is there a parking?"/>
                  </div>
                  <div>
                    <Label class="text-white mb-1">Minimum nights per reservation</Label>
                    <Input type="number" min="1" bind:value={selectedPlace.minNight}/>
                  </div>
            
                  <div class="md:col-span-2 lg:col-span-2">
                    <Textarea {...textareaprops} bind:value={selectedPlace.description}/>
                  </div>


                  <div id="images-container" class="md:col-span-2 lg:col-span-2 grid grid-cols-2 gap-2"></div>
                  <div class="md:col-span-2 lg:col-span-2 w-80 flex justify-center items-center">
                    <Button color="blue" on:click={openFileInput}>Add image</Button>
                    <input type="file" id="image-upload" class="hidden" multiple on:change={handleImageUpload}/>
                  </div>


                  

                  {#each datePricePairs as { dateRange, price }, index}
                      <div>
                          <Input on:change={() => { updateDisabledRanges()}} bind:value={dateRange} type="text" id={"datepicker-" + index} placeholder="Click here to select a date" class="rounded-md w-15">
                          </Input>
                      </div>
                      <div>
                          <Input bind:value={price} placeholder="Price per night in €" class="w-28 h-10">
                          </Input>
                      </div>
                  {/each}

                  <Button on:click={() => changeData()}>
                    Modify
                  </Button>
                  
                  <Button color="dark" on:click={() => selectedPlace && deletePlace(selectedPlace.id, selectedPlace.folder)}>Delete place</Button>
                  <Button color="blue" on:click={closeDialog}>
                    Close
                  </Button>

            </Card>
        </div>
    {/if}
{/if}


