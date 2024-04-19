<script lang="ts">
    import {Card, Button, Input, Search} from 'flowbite-svelte';
    import {HomeSolid, CalendarMonthSolid, UsersSolid, SearchOutline } from 'flowbite-svelte-icons';
    import { onMount} from 'svelte';
    import { writable } from 'svelte/store';
    import { storage } from '../../firebase';
    import { ref, getDownloadURL, listAll, getMetadata} from 'firebase/storage';
    import flatpickr from 'flatpickr';
    import 'flatpickr/dist/flatpickr.css';
	import { stringify } from 'postcss';

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
let filteredPlaces: Place[] = [];

let selectedPlace: Place | null = null;
let showImage:boolean = false;

const imagesLoaded = writable(false);
let isOpen = false;
// @ts-ignore
let fp;



let dateRangesPrice: { from: string; to: string; price: string }[]
let totalPrice = 0;
let emailGuest: string;
let selectedDates: string[]
let reserveBool = false;

let country: string = "";
let city: string = "";
let maxPeople: number;
let bedNumber: number;
let childrenNumber: number;
let reviewCheck: boolean = false;

let reviews: string[] = [];


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
            //console.log('All places:', places);
            filteredPlaces = places;
            //console.log("Filtered places: ", filteredPlaces);
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
        //console.log("Retrieved images:", imageURLs);
    } catch (error) {
        console.error("Error retrieving images:", error);
    }
};


function extractDates(reservationString: string): string[] {
    const dateRegex = /\d{2}-\d{2}-\d{4}/g; // Regular expression to match dates in the format dd-mm-yyyy
    const dates: string[] = [];
    
    const reservations = reservationString.trim().split(/\s*,\s*/); // Split reservations
    
    reservations.forEach(reservation => {
        const matches = reservation.match(dateRegex); // Match dates in the reservation
        
        if (matches && matches.length === 2) { 
            const [startDateStr, endDateStr] = matches;
            const [startDay, startMonth, startYear] = startDateStr.split('-').map(Number); 
            const [endDay, endMonth, endYear] = endDateStr.split('-').map(Number); 
            
            const startDate = new Date(startYear, startMonth - 1, startDay); 
            const endDate = new Date(endYear, endMonth - 1, endDay); 
            
            let currentDate = new Date(startDate);
            
            while (currentDate <= endDate) {
                // Format the date manually as d-m-y
                const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
                dates.push(formattedDate); 
                currentDate.setDate(currentDate.getDate() + 1); 
            }
        }
    });
    
    return dates;
}

function extractDatesFromRanges(dateRanges: { from: string, to: string }[]): string[] {
    const dates: string[] = [];

    dateRanges.forEach(range => {
        const [fromDay, fromMonth, fromYear] = range.from.trim().split('-').map(Number);
        const [toDay, toMonth, toYear] = range.to.trim().split('-').map(Number);

        const startDate = new Date(fromYear, fromMonth - 1, fromDay); // Month is 0-indexed
        const endDate = new Date(toYear, toMonth - 1, toDay);

        //console.log("Start Date:", startDate);
        //console.log("End Date:", endDate);

        let currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
            dates.push(formattedDate);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    });

    return dates;
}

 function formatReviews() {
    // Regular expression to match the contents inside square brackets
    const regex = /\[(.*?)\]/g;
    let match;
    console.log("For this review",selectedPlace?.review);
    
     // @ts-ignore
    while ((match = regex.exec(selectedPlace?.review)) !== null) {
        reviews.push(`- Review grade: ${match[1].split(' ')[0]}, Description: ${match[1].substring(match[1].indexOf(' ') + 1)}`);
    }

    console.log("Review",reviews);
    if(reviews.length != 0){
      reviewCheck = true;
    }

}

async function openDialog(place: Place) {
    reviews = [];
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
    //console.log("Selected dates: ", selectedPlace.dates);
    await getImagesForOpenedDialog();
    formatReviews();
    
    const dateRanges = selectedPlace.dates.split(',').map(dateRange => {
        const [datesPart, pricePart] = dateRange.split(' for ');
        const [from, to] = datesPart.split(' to ');
        return { from, to };
    });
    
    const disableDatesArray = extractDates(selectedPlace.reservation);
    //console.log(selectedPlace.reservation);
    //console.log("DA: ", disableDatesArray);
    //console.log("RANGE:", dateRanges);
    let datesArray = extractDatesFromRanges(dateRanges);
    //console.log("MR: ",datesArray);

    datesArray = datesArray.filter(date => !disableDatesArray.includes(date));
    //console.log("FILTERED:", datesArray);


    dateRangesPrice = selectedPlace.dates.split(',').map(dateRange => {
      const [datesPart, pricePart] = dateRange.split(' for ');
      const [from, to] = datesPart.split(' to ');
      const price = pricePart.split(' ')[0]; 
      return { from, to, price: `${price}` };
      });
    //console.log(dateRangesPrice);

    const dateRangesFormatted = dateRangesPrice.map(range => {
        const [fromDay, fromMonth, fromYear] = range.from.split('-').map(Number);
        const [toDay, toMonth, toYear] = range.to.split('-').map(Number);

        const fromDate = new Date(fromYear, fromMonth - 1, fromDay);
        const toDate = new Date(toYear, toMonth - 1, toDay);

        // Format the dates as "May 10, 2024"
        const fromFormatted = fromDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const toFormatted = toDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        return { from: fromFormatted, to: toFormatted, price: range.price };
    });

    //console.log("DRF!:",dateRangesFormatted);

    fp = flatpickr(`#dateInput`, {
      dateFormat: "d-m-Y", 
      minDate: "today",
      mode: "range",
      enable: datesArray,
      onDayCreate: function(dObj, dStr, fp, dayElem) {
        dateRangesFormatted.forEach(range => {
            const startDate = new Date(range.from);
            const endDate = new Date(range.to);
            const currentDate = new Date(dayElem.ariaLabel);

            if (currentDate >= startDate && currentDate <= endDate) {
                dayElem.innerHTML += `<span class='absolute top-4 left-4 text-[10px]'>${range.price}</span>`;
            }
        });
    }
      });

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
    reviewCheck = false;
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

// @ts-ignore
function filterPlacesByCategory(category: string): (event: MouseEvent<HTMLDivElement>) => void {  
  return (event) => {
        filteredPlaces = places;

        if(category !== "All places"){
          filteredPlaces = filteredPlaces.filter(place => place.type === category);
        }
        console.log(filteredPlaces);
    };
}


function calculateTotalPrice() {
     totalPrice = 0;
    // @ts-ignore
    selectedDates = fp.selectedDates.map((date: Date) => {
        const formattedDate = date.toLocaleDateString('en-GB');
        const [day, month, year] = formattedDate.split('/');
        return `${day}-${month}-${year}`;
    });
    
    const dates: Date[] = selectedDates.map(dateStr => {
        const [day, month, year] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day); 
    });

    // Find the range between the dates
    const filledDates: Date[] = [];
    for (let i = 0; i < dates.length - 1; i++) {
        const currentDate = new Date(dates[i]);
        const nextDate = new Date(dates[i + 1]);
        while (currentDate < nextDate) {
            filledDates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    // Convert Date objects back to strings
    const filledDateStrings: string[] = filledDates.map(date => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    });
    

    const correctedDateRangesPrice = dateRangesPrice.map(obj => {
        return {
            from: obj.from.trim(), // Trim extra space
            to: obj.to,
            price: parseInt(obj.price)
        };
    });
    
    //console.log("SD: ", filledDateStrings);
    //console.log("CDRP: ", correctedDateRangesPrice);

    for (const selectedDate of filledDateStrings) {
        // Convert selectedDate string to Date object for comparison
        const [day, month, year] = selectedDate.split('-');
        const date = new Date(`${year}-${month}-${day}`);

        //console.log('Checking date:', date);

        // Find the corresponding date ranges
        const correspondingDateRanges = correctedDateRangesPrice.filter(dateRange => {
            const [rangeDay, rangeMonth, rangeYear] = dateRange.from.split('-');
            const fromDate = new Date(`${rangeYear}-${rangeMonth}-${rangeDay}`);
            const [toDay, toMonth, toYear] = dateRange.to.split('-');
            const toDate = new Date(`${toYear}-${toMonth}-${toDay}`);
            return date >= fromDate && date <= toDate;
        });

        //console.log('Corresponding date ranges:', correspondingDateRanges);

        // If any corresponding date range is found, add their prices to the total
        if (correspondingDateRanges.length > 0) {
            for (const dateRange of correspondingDateRanges) {
                totalPrice += dateRange.price;
            }
        }
    }

    console.log("Total Price:", totalPrice + "€");
    if(totalPrice != 0){
      reserveBool = true;
    }
}


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
          console.log("TP:", totalPrice);
          console.log("ARR",selectedDates);

          let together = emailGuest + " " + totalPrice.toString() + "€" + " " + selectedDates[0] + " " + selectedDates[1] + " , ";
          //console.log(together);
          // @ts-ignore
          selectedPlace.reservation = selectedPlace.reservation + together;
          
          // @ts-ignore
          updateReservation(selectedPlace.id, selectedPlace.reservation);

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

  async function updateReservation(placeId: number, reservation: string): Promise<void> {
  try {
    console.log("N:", placeId);
    console.log("R:", reservation);
    const url = `http://127.0.0.1:8000/updateReservation/${placeId}?reservation=${encodeURIComponent(reservation)}`;
    const response = await fetch(url, {
      method: 'PUT',
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to update reservation: ${errorMessage}`);
    }

    console.log('Reservation updated successfully');
  } catch (error) {
    console.error('Error updating reservation:', error);
  }
}

function searchForPlace(){
  filteredPlaces = places;

  if(country !== ""){
    filteredPlaces = filteredPlaces.filter(place => place.country === country);
  }

  if(city !== ""){
    filteredPlaces = filteredPlaces.filter(place => place.city === city);
  }

  if(maxPeople != undefined){
    filteredPlaces = filteredPlaces.filter(place => place.maxPeople == maxPeople);
  }

  if(bedNumber != undefined){
    filteredPlaces = filteredPlaces.filter(place => place.beds == bedNumber);
  }

  if(childrenNumber != undefined){
    filteredPlaces = filteredPlaces.filter(place => place.children == childrenNumber);
  }

  //console.log(filteredPlaces);
}
</script>
 
<div id="mainDiv" class="flex justify-center items-center grid grid-flow-row auto-rows-max gap-14">
  <Card class="mt-32 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 bg-berkeley-blue max-w-6xl text-white shadow-2xl drop-shadow-lg border-2 border-sky-600 text-center">
    <form class="flex gap-2 col-span-2">
      <Input size="md" placeholder="Country" bind:value = {country}/>
      <Input size="md" placeholder="City" bind:value = {city}/>
      <Input size="md" placeholder="Maximum number of people" bind:value = {maxPeople}/>
    </form>
    <form class="flex gap-2 col-span-2">
      <Input size="md" placeholder="Number of beds" bind:value = {bedNumber}/>
      <Input size="md" placeholder="Number of children" bind:value = {childrenNumber}/>
      <Button class="!p-2.5" on:click={searchForPlace}>
        <SearchOutline class="w-5 h-5" />
      </Button>
    </form>
    <div on:click={filterPlacesByCategory("Apartment")} role="button" tabindex="0" class="relative group" on:keydown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        filterPlacesByCategory("Apartment");} }}>
      <img src="/apartments.jpg" class="rounded-lg h-40 w-48 md:h-48 md:w-64 lg:h-48 lg:w-64 hover:outline" alt="product 1"/>
      <p class="absolute top-0 left-0 bg-berkeley-blue text-white px-2 py-1 rounded-tr-lg border-white border-2">Apartments</p>
    </div>
    <div on:click={filterPlacesByCategory("Hotel")} role="button" tabindex="0" class="relative group" on:keydown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        filterPlacesByCategory("Hotel");} }}>
        <img src="/hotels.jpg" class="rounded-lg h-40 w-48 md:h-48 md:w-64 lg:h-48 lg:w-64 hover:outline" alt="product 1"/>
        <p class="absolute top-0 left-0 bg-berkeley-blue text-white px-2 py-1 rounded-tr-lg border-white border-2">Hotels</p>
    </div>
    <div on:click={filterPlacesByCategory("Hostel")} role="button" tabindex="0" class="relative group" on:keydown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        filterPlacesByCategory("Hostel");} }}>
        <img src="/hostels.jpg" class="rounded-lg h-40 w-48 md:h-48 md:w-64 lg:h-48 lg:w-64 hover:outline" alt="product 1"/>
        <p class="absolute top-0 left-0 bg-berkeley-blue text-white px-2 py-1 rounded-tr-lg border-white border-2">Hostels</p>
    </div>
    <div on:click={filterPlacesByCategory("Motel")} role="button" tabindex="0" class="relative group" on:keydown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        filterPlacesByCategory("Motel");} }}>
        <img src="/motels.jpeg" class="rounded-lg h-40 w-48 md:h-48 md:w-64 lg:h-48 lg:w-64 hover:outline" alt="product 1"/>
        <p class="absolute top-0 left-0 bg-berkeley-blue text-white px-2 py-1 rounded-tr-lg border-white border-2">Motels</p>
    </div>
    <div on:click={filterPlacesByCategory("Villa")} role="button" tabindex="0" class="relative group" on:keydown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        filterPlacesByCategory("Villa");} }}>
        <img src="/villas.jpeg" class="rounded-lg h-40 w-48 md:h-48 md:w-64 lg:h-48 lg:w-64 hover:outline" alt="product 1"/>
        <p class="absolute top-0 left-0 bg-berkeley-blue text-white px-2 py-1 rounded-tr-lg border-white border-2">Villas</p>
    </div>
    <div on:click={filterPlacesByCategory("Cabin")} role="button" tabindex="0" class="relative group" on:keydown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        filterPlacesByCategory("Cabin");} }}>
        <img src="/cabins.jpeg" class="rounded-lg h-40 w-48 md:h-48 md:w-64 lg:h-48 lg:w-64 hover:outline" alt="product 1"/>
        <p class="absolute top-0 left-0 bg-berkeley-blue text-white px-2 py-1 rounded-tr-lg border-white border-2">Cabins</p>
    </div>
    <div on:click={filterPlacesByCategory("Cottage")} role="button" tabindex="0" class="relative group" on:keydown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        filterPlacesByCategory("Cottage");} }}>
        <img src="/cottages.jpg" class="rounded-lg h-40 w-48 md:h-48 md:w-64 lg:h-48 lg:w-64 hover:outline" alt="product 1"/>
        <p class="absolute top-0 left-0 bg-berkeley-blue text-white px-2 py-1 rounded-tr-lg border-white border-2">Cottages</p>
    </div>
    <div on:click={filterPlacesByCategory("All places")} role="button" tabindex="0" class="relative group" on:keydown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        filterPlacesByCategory("All places");} }}>
      <img src="/resorts.jpeg" class="rounded-lg h-40 w-48 md:h-48 md:w-64 lg:h-48 lg:w-64 hover:outline" alt="product 1"/>
      <p class="absolute top-0 left-0 bg-berkeley-blue text-white px-2 py-1 rounded-tr-lg border-white border-2">All places</p>
    </div>
  </Card>

  {#if filteredPlaces.length !== 0}
    <Card class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 bg-berkeley-blue max-w-6xl text-white shadow-2xl drop-shadow-lg border-2 border-sky-600 mt-16 mb-28">
      {#if $imagesLoaded}
        {#each filteredPlaces as place (place.id)}
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

{#if isOpen}
  <div class="h-[650px]">
  </div>
  {/if}
</div>



{#if isOpen}
  {#if selectedPlace}
        <div class="absolute inset-0 flex justify-center items-center">
            <Card class="mt-[1800px] md:mt-[1200px] lg:mt-[1200px] grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-2 md:gap-4 lg:gap-4 bg-berkeley-blue max-w-2xl text-white shadow-2xl drop-shadow-lg border-2 border-sky-600">
              <h1 class="text-4xl font-bold text-center col-span-2 md:col-span-2 lg:col-span-2">{selectedPlace.type} {selectedPlace.name}</h1>

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

              <p class="text-center col-span-2 text-3xl font-bold mt-12">Dates and prices</p>

              <Input id="dateInput" placeholder="Select Date" on:input={calculateTotalPrice}/>
              <p>Total price: {totalPrice}€</p>
              <Button href="/app/journeyLog" on:click={check} disabled={!reserveBool}>
                Reserve
              </Button>

              <Button color="blue" on:click={closeDialog}>
                Close</Button>
                {#if reviewCheck}
                  <p class="text-center col-span-2 text-3xl font-bold mt-12">Reviews and scores(0-10)</p>
                  {#each reviews as review}
                      <p class="md:col-span-2 lg:col-span-2">{review}</p>
                  {/each}
                {/if}
            </Card>
        </div>
  {/if}
{/if}

 
  
  
  
    
  
  