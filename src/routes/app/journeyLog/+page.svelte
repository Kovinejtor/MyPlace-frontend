<script lang="ts">
    import { onMount } from 'svelte';
    import {Card, Button, Input, Search, Textarea, Label} from 'flowbite-svelte';
    import { writable } from 'svelte/store';
    import { storage } from '../../../firebase';
    import { ref, getDownloadURL, listAll, getMetadata} from 'firebase/storage';

    let emailGuest: string;
    let justOnce = true;
    let isOpen = false;
    let isOpenSecond = false;
    let showImage:boolean = false;
   

    let currentIndex = 0;
    let filteredReservations: string[] = [];
    let review: string;
    let reviewGrade: number;
    let reviewButton: boolean = true;
    let completeReview: string;


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
        review: string;
        }

        
    let places: Place[] = [];

    const beforeToday: Place[] = [];
    const afterToday: Place[] = [];

    let selectedPlace: Place | null = null;
    const imagesLoaded = writable(false);

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    let textareaprops = {
        id: 'message',
        name: 'message',
        label: 'Your message',
        rows: 4,
        placeholder: 'Write a review about the place'
    };


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

function filterPlaces() {
    places.forEach(place => {
        let addedToBefore = false; // Flag to track if the place has been added to the 'beforeToday' category
        let addedToAfter = false; // Flag to track if the place has been added to the 'afterToday' category
        const reservations = place.reservation.split(",");
        reservations.forEach(reservation => {
            const [email, , , endDateStr] = reservation.trim().split(" ");
            if (endDateStr) { // Check if endDateStr is defined
                const [dd, mm, yyyy] = endDateStr.split("-").map(Number); // Parse date components as numbers
                const endDate = new Date(yyyy, mm - 1, dd); // Month is 0-indexed in JavaScript Date
                if (email === emailGuest) {
                    if (endDate <= currentDate && !addedToBefore) {
                        beforeToday.push(place);
                        addedToBefore = true; // Set the flag to true after adding to the 'beforeToday' category
                    } else if (endDate > currentDate && !addedToAfter) {
                        afterToday.push(place);
                        addedToAfter = true; // Set the flag to true after adding to the 'afterToday' category
                    }
                }
            }
        });
    });

    console.log("BT:", beforeToday);
    console.log("AT:", afterToday);
}

async function openDialog(place: Place) {
    const mainDiv = document.getElementById('mainDiv');
    if (mainDiv) {
        mainDiv.classList.add('blur-lg');
    }

    const mainCard = document.getElementById('mainCard');
        if (mainCard) {
            mainCard.classList.add('h-screen');
    }

    isOpen = true;
    
    selectedPlace = place;
    convertReservation();
    await getImagesForOpenedDialog();
}

async function openDialogSecondCard(place: Place) {
    const mainDiv = document.getElementById('mainDiv');
    if (mainDiv) {
        mainDiv.classList.add('blur-lg');
    }

    const secondMainCard = document.getElementById('secondMainCard');
        if (secondMainCard) {
            secondMainCard.classList.add('h-screen');
    }

    isOpenSecond = true;
    
    selectedPlace = place;
    await getImagesForOpenedDialog();
}

function closeDialogSecondCard() {
    const mainDiv = document.getElementById('mainDiv');
    if (mainDiv) {
        mainDiv.classList.remove('blur-lg');
    }

    const secondMainCard = document.getElementById('secondMainCard');
        if (secondMainCard) {
            secondMainCard.classList.remove('h-screen');
    }

    isOpenSecond = false;
    showImage = false;
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
        //console.log("Retrieved images:", imageURLs);
    } catch (error) {
        console.error("Error retrieving images:", error);
    }
};

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
    showImage = false;
  }

  function convertReservation() {
    //console.log("CURDATE",currentDate);
    if (selectedPlace && selectedPlace.reservation) {
        let reservationString = selectedPlace.reservation.trim();
        
        if (reservationString.endsWith(',')) {
            reservationString = reservationString.slice(0, -1);
        }

        const reservations = reservationString.split(',').map(reservation => reservation.trim());

        const formattedReservations = reservations.map(reservation => {
            const [email, price, startDate, endDate] = reservation.split(' ');
            return ` - ${email} for ${price} from ${startDate} to ${endDate}`;
        });

        //console.log(formattedReservations);

        filteredReservations = formattedReservations.filter(reservation => {
            
            const endDateString = reservation.split(' to ')[1];
            //console.log("End Date String:", endDateString); 
            
            const [dayStr, monthStr, yearStr] = endDateString.split('-');
            const day = parseInt(dayStr, 10);
            const month = parseInt(monthStr, 10) - 1; 
            const year = parseInt(yearStr, 10);
            
            const endDate = new Date(year, month, day);
            
            //console.log("End Date:", endDate);
            
            return endDate > currentDate;
        });

        filteredReservations = filteredReservations.filter(reservation => {
            return reservation.includes(emailGuest);
        });

        filteredReservations = filteredReservations.map(reservation => {
            return reservation.replace(emailGuest, "You reserved");
        });
        console.log("FILTERED:",filteredReservations);
    } else {
        console.log("selectedPlace or selectedPlace.reservation is null or undefined.");
    }
}

async function cancelReservation(reservation: string){
    console.log(reservation);
    console.log(selectedPlace?.reservation);

    const datesRegex = /from (\d{2}-\d{2}-\d{4}) to (\d{2}-\d{2}-\d{4})/;
    const matches = reservation.match(datesRegex);

    if (matches && matches.length >= 3) {
        const fromDate = matches[1];
        const toDate = matches[2];

        // Constructing a regex pattern to remove entries containing the dates
        const removePattern = new RegExp(`[^,]*${fromDate}[^,]*${toDate}[^,]*,?`, "g");
        
        // Removing entries containing the dates from selectedPlaceReservation
        const newSelectedPlaceReservation = selectedPlace?.reservation.replace(removePattern, '');

        console.log(newSelectedPlaceReservation);
        console.log(selectedPlace?.id);

        try {
            const url = `http://127.0.0.1:8000/updateReservation/${selectedPlace?.id ?? ''}?reservation=${encodeURIComponent(newSelectedPlaceReservation ?? '')}`;
            const response = await fetch(url, {
                method: 'PUT',
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to cancel reservation: ${errorMessage}`);
            }
            window.location.reload();
            console.log('Reservation canceled successfully');
        } catch (error) {
            console.error('Error canceling reservation:', error);
        }
    } else {
        console.log("Invalid reservation format");
    }
}

$: {
    if(review != undefined && reviewGrade != undefined){
        reviewButton = false;
        completeReview = selectedPlace?.review + "[" + reviewGrade.toString() + " " + review + "], ";
        console.log(completeReview);
    }
  }

async function sendReview(){
    console.log(review);
    console.log(reviewGrade);

    try {
            const url = `http://127.0.0.1:8000/updateReview/${selectedPlace?.id ?? ''}?review=${encodeURIComponent(completeReview ?? '')}`;
            const response = await fetch(url, {
                method: 'PUT',
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to send review: ${errorMessage}`);
            }

            console.log('Review sent successfully');


        } catch (error) {
            console.error('Error sending review:', error);
        }
    
    deleteReviewedReservations();
    
}

async function deleteReviewedReservations() {
    //console.log("RESERVATION:", selectedPlace?.reservation);
    //console.log("EMAIL:", emailGuest);

    const currentDate = new Date();

    const currentUserReservations = selectedPlace?.reservation.split(',')
        .filter(reservation => {
            const endDate = new Date(reservation.split(' ')[3]);
            return reservation.includes(emailGuest) && endDate > currentDate;
        });

    const remainingReservations = selectedPlace?.reservation.split(',')
        .filter(reservation => !currentUserReservations?.some(currentUserReservation => currentUserReservation.trim() === reservation.trim()));

    const updatedReservation = remainingReservations?.join(',').trim();
    console.log("Updated RESERVATION:", updatedReservation);
   
    try {
            const url = `http://127.0.0.1:8000/updateReservation/${selectedPlace?.id ?? ''}?reservation=${encodeURIComponent(updatedReservation ?? '')}`;
            const response = await fetch(url, {
                method: 'PUT',
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed remove old reservation: ${errorMessage}`);
            }
        
            console.log('Old reservation removed successfully');
        } catch (error) {
            console.error('Error removing old reservation:', error);
        }
    window.location.reload();
}


</script>

<div id="mainDiv" class="flex justify-center items-center grid grid-flow-row auto-rows-max gap-14 mt-[80px]">
    
    {#if $imagesLoaded && afterToday.length !== 0}
        <Card class="grid grid-cols-3 gap-4 bg-berkeley-blue max-w-6xl text-white shadow-2xl drop-shadow-lg border-2 border-sky-600 mb-28 mt-16">
            <h1 class="text-4xl font-bold text-center md:col-span-3 lg:col-span-3 mb-8">Places that you reserved</h1>
                {#each afterToday as place (place.id)}
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
            
        </Card>
    {/if} 
    {#if $imagesLoaded && beforeToday.length !== 0}
        <Card id="secondMainCard" class="grid grid-cols-3 gap-4 bg-berkeley-blue max-w-6xl text-white shadow-2xl drop-shadow-lg border-2 border-sky-600 mt-16 mb-24">
                <h1 class="text-4xl font-bold text-center md:col-span-3 lg:col-span-3 mb-8">Write a review about the places you rented</h1>
                {#each beforeToday as place (place.id)}
                    <div class="max-w-sm rounded overflow-hidden shadow-lg hover:outline" on:click={() => openDialogSecondCard(place)} role="button" tabindex="0" on:keydown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          openDialogSecondCard(place);} }} >
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



{#if isOpen}
  {#if selectedPlace}
        <div class="absolute inset-0 flex justify-center items-center">
            <Card class="mt-[1300px] md:mt-[1000px] lg:mt-[1000px] grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 md:gap-4 lg:gap-4 bg-berkeley-blue max-w-2xl text-white shadow-2xl drop-shadow-lg border-2 border-sky-600">
              <h1 class="text-4xl font-bold text-center md:col-span-2 lg:col-span-2 mb-10">{selectedPlace.type} {selectedPlace.name}</h1>
              
              {#each filteredReservations as reservation}
                <div class="grid grid-cols-4 col-span-2">
                    <p class="col-span-3">{reservation}</p>
                        <Button color="red" class="col-span-1 mb-4" on:click={() => cancelReservation(reservation)}>Cancel reservation</Button>
                </div>  
              {/each}

              <p class="text-center mt-5">Email of the place owner: {selectedPlace.authorEmail}</p>
              <p class="text-center mt-5">Country: {selectedPlace.country}</p>
              <p class="text-center mt-5">City: {selectedPlace.city}</p>
              <p class="text-center mt-5">Adress: {selectedPlace.adress}</p>
              
              <p class="text-center mt-5">Maximum number of people: {selectedPlace.maxPeople}</p>
              <p class="text-center mt-5">Number of beds: {selectedPlace.beds}</p>
              <p class="text-center mt-5">Number of adults: {selectedPlace.adults}</p>
              

              <p class="text-center mt-5">Number of children: {selectedPlace.children}</p>
              <p class="text-center mt-5">Are animals allowed?: {selectedPlace.animals}</p>
              <p class="text-center mt-5">Is there a parking?: {selectedPlace.parking}</p>

              <p class="text-center mt-5">Minimum nights per reservation: {selectedPlace.minNight}</p>
              <p class="col-span-2 text-center mt-5">Description: {selectedPlace.description}</p>

              <p class="text-center col-span-2 text-3xl font-bold mt-12">Images of the place</p>
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


              <Button color="blue" on:click={closeDialog}>
                Close</Button>
            </Card>
        </div>
  {/if}
{/if}


{#if isOpenSecond}
  {#if selectedPlace}
        <div class="absolute inset-0 flex justify-center items-center">
            <Card class="mt-[1300px] md:mt-[1000px] lg:mt-[1000px] grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 md:gap-4 lg:gap-4 bg-berkeley-blue max-w-2xl text-white shadow-2xl drop-shadow-lg border-2 border-sky-600">
              <h1 class="text-4xl font-bold text-center md:col-span-2 lg:col-span-2 mb-10">{selectedPlace.type} {selectedPlace.name}</h1>
              <Textarea bind:value={review} class="md:col-span-2 lg:col-span-2" {...textareaprops}/>
              <div>
                <Label class="text-white mb-1">Rate the place from 1 to 10</Label>
                <Input bind:value={reviewGrade} type="number" min="1" max="10"/>
              </div>
              <Button on:click={sendReview} disabled={reviewButton}>Send review</Button>
              <Button on:click={deleteReviewedReservations}>hej</Button>

              <p class="text-center mt-5">Email of the place owner: {selectedPlace.authorEmail}</p>
              <p class="text-center mt-5">Country: {selectedPlace.country}</p>
              <p class="text-center mt-5">City: {selectedPlace.city}</p>
              <p class="text-center mt-5">Adress: {selectedPlace.adress}</p>
              
              <p class="text-center mt-5">Maximum number of people: {selectedPlace.maxPeople}</p>
              <p class="text-center mt-5">Number of beds: {selectedPlace.beds}</p>
              <p class="text-center mt-5">Number of adults: {selectedPlace.adults}</p>
              

              <p class="text-center mt-5">Number of children: {selectedPlace.children}</p>
              <p class="text-center mt-5">Are animals allowed?: {selectedPlace.animals}</p>
              <p class="text-center mt-5">Is there a parking?: {selectedPlace.parking}</p>

              <p class="text-center mt-5">Minimum nights per reservation: {selectedPlace.minNight}</p>
              <p class="col-span-2 text-center mt-5">Description: {selectedPlace.description}</p>

              <p class="text-center col-span-2 text-3xl font-bold mt-12">Images of the place</p>
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


              <Button color="blue" on:click={closeDialogSecondCard}>
                Close</Button>
            </Card>
        </div>
  {/if}
{/if}
