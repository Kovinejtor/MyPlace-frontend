<script lang="ts">
    import {Card, Button, Label, Select, Input, Textarea, Fileupload, Listgroup, ListgroupItem, Checkbox  } from 'flowbite-svelte';
    import { onMount, afterUpdate  } from 'svelte';
    import { v4 as uuidv4 } from 'uuid';
    import { app, storage } from '../../../../firebase';
    import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
    import flatpickr from 'flatpickr';
    import 'flatpickr/dist/flatpickr.css';
    import {CalendarMonthSolid, EuroSolid} from 'flowbite-svelte-icons';


    

    let selectedDate: string = "";
  let isLastInputFilled: boolean = false;
  let counter: number = 1;
  let dateInputs: { id: number; date: string; price: string }[] = [{ id: 1, date: "", price: "" }];

  const initializeFlatpickr = (selector: string, id: number) => {
    const flatpickrInstance = flatpickr(selector, {
        mode: "range",
        minDate: "today",
        dateFormat: 'd-m-Y',
        disable: getDisabledDates(id), 
        onChange: (selectedDates, dateStr) => {
            dateInputs = dateInputs.map(input => (input.id === id ? { ...input, date: dateStr } : input));
            console.log(dateInputs);
            updateDisabledDates(flatpickrInstance, id); 
        },
    });
};

const updateDisabledDates = (instance: any, id: number) => {
    const disabledDates = getDisabledDates(id);
    instance.set("disable", disabledDates);
};

const getDisabledDates = (excludeId: number) => {
    const disabledDates = dateInputs
        .filter(input => input.id !== excludeId)
        .flatMap(input => {
            if (input.date.includes(' to ')) {
                const [fromDate, toDate] = input.date.split(' to ');
                return [{ from: fromDate, to: toDate }];
            } else {
                return { from: input.date, to: input.date };
            }
        });

    return disabledDates;
};



  onMount(() => {
      initializeFlatpickr('#datepicker', 1);
      check();
  });

  const addDateInput = () => {
      const id = dateInputs.length + 1;
      dateInputs = [...dateInputs, { id, date: "", price: "" }];
      counter += 1;

      setTimeout(() => {
          const selector = `#datepicker-${id}`;
          initializeFlatpickr(selector, id);
      }, 0);
  };

  $: formattedDates = dateInputs.map(({ date, price }) => ({ date, price }));
      

  $: {
      isLastInputFilled = formattedDates.every(({ date, price }) => date !== '' && price !== '') && counter == formattedDates.length;
  }

 


  let agree: boolean = false;

  let newPlace = {
    type: "",
    name: "",
    country: "",
    city: "",
    adress: "",
    maxPeople: 1,
    beds: 1,
    adults: 1,
    children: 0,
    animals: "",
    parking: "",
    minNight: 1,
    description: "",
    folder: "",
    dates: "",
    authorEmail: "",
    images: [] as File[],
    reservation: "",
    review: "",
  };

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
          newPlace.authorEmail = result;
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

    
    let fileuploadprops = {
        id: 'user_avatar'
    };

    let fileuploadprops2 = {
        id: 'user_avatar2'
    };

    let files: FileList;

    let imagePreviews: { id: number; src: string; file: File }[] = [];
  let previewIdCounter = 0;

  function handleFileUpload() {
    if (files) {
      const newPreviews = Array.from(files).map((file) => ({
        id: previewIdCounter++,
        src: URL.createObjectURL(file),
        file: file,
      }));

      imagePreviews = [...imagePreviews, ...newPreviews];

      newPlace.images = [...newPlace.images, ...newPreviews.map((preview) => preview.file)];
    }
  }

  function removeImage(id: number) {
    const removedImage = imagePreviews.find((img) => img.id === id);

    if (removedImage) {
      imagePreviews = imagePreviews.filter((img) => img.id !== id);
      newPlace.images = newPlace.images.filter((file) => file !== removedImage.file);
    }
  }

  function openFileInput() {
    const fileInput = document.getElementById('image-upload');
    fileInput?.click();
  }

  
  

  let valid: boolean = false;

  

const addPlace = async () => {
    try {
      newPlace.dates = formattedDates.map(({ date, price }) => `${date} for ${price}€`).join(', ');
      //console.log(newPlace.dates);
      console.log(`Type of newPlace.dates: ${typeof newPlace.dates}`);

      const folderName = uuidv4();
      newPlace.folder = folderName;

    const imageUrls: string[] = await Promise.all(
      newPlace.images.map(async (image) => {
        const storageRef = ref(storage, `images/${folderName}/${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        return downloadUrl;
      })
    );
    console.log(newPlace);
      const response = await fetch('http://127.0.0.1:8000/addPlace/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlace),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Place created successfully:', result);
      } else {
        console.error('Failed to create place:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating place:', error);
    }
  };

  const handleSubmit = () => {
    addPlace();
  };

  const isFormValid = () => {
    if (
        newPlace.type.trim() !== "" && 
        newPlace.name.trim() !== "" &&
        newPlace.country.trim() !== "" &&
        newPlace.city.trim() !== "" &&
        newPlace.adress.trim() !== "" &&
        newPlace.animals.trim() !== "" &&
        newPlace.parking.trim() !== "" &&
        newPlace.description.trim() !== "" &&
        newPlace.images.length >= 5 &&
        dateInputs.every(input => input.date !== "" && input.price !== "")
    ) {
        valid = true;
    }
    else{
        valid = false;
    }
    //console.log(dateInputs[0].date);
    //console.log(formattedDates);
};

 function changeAgree(){
    agree = !agree;
 }

 const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    let inputValue = target.value;
    inputValue = inputValue.replace(/[^0-9]/g, '');


    dateInputs[0].price = inputValue;
    isFormValid();
};

const handleSecondInput = (event: Event, id: number) => {
    const target = event.target as HTMLInputElement;
    let inputValue = target.value;

    inputValue = inputValue.replace(/[^0-9]/g, '');
    dateInputs = dateInputs.map(input => (input.id === id ? { ...input, price: inputValue } : input));

    isFormValid();
};


</script>
 

<div class="flex justify-center items-center grid grid-flow-row auto-rows-max gap-14">
  <Card class="grid max-w-xl grid-rows-6 grid-flow-col bg-berkeley-blue text-white shadow-2xl drop-shadow-lg border-2 border-sky-600 mt-28">
    <h1 class="text-2xl font-bold text-center mt-7">If you want to add a place to the catalog you need to fill this form and accept the terms of service.</h1>

    <div class="row-span-5 grid grid-rows-12 md:grid-rows-6 lg:grid-rows-6 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8 md:mt-20 lg:mt-20">
      <div>
        <Label class="text-white mb-1">Type of place</Label>
        <Select items={countries} bind:value={newPlace.type} placeholder="Type of place" on:change={() => isFormValid()}/>  
      </div>
      <div>
        <Label class="text-white mb-1">Name of the place</Label>
        <Input bind:value={newPlace.name} placeholder="Name for the place" on:input={() => isFormValid()} />
      </div>
      <div>
        <Label class="text-white mb-1">Name of the country</Label>
        <Input bind:value={newPlace.country} placeholder="Country" on:input={() => isFormValid()} />
      </div>
      <div>
        <Label class="text-white mb-1">Name of the city</Label>
        <Input bind:value={newPlace.city} placeholder="City" on:input={() => isFormValid()} />
      </div>
      <div>
        <Label class="text-white mb-1">Insert the address</Label>
        <Input bind:value={newPlace.adress} placeholder="Adress" on:input={() => isFormValid()} />
      </div>

      <div>
        <Label class="text-white mb-1">Maximum number of people</Label>
        <Input type="number" min="1" bind:value={newPlace.maxPeople} on:input={() => isFormValid()} />
      </div>
      <div>
        <Label class="text-white mb-1">Number of beds</Label>
        <Input type="number" min="1" bind:value={newPlace.beds} on:input={() => isFormValid()} />
      </div>
      <div>
        <Label class="text-white mb-1">Number of adults</Label>
        <Input type="number" min="1" bind:value={newPlace.adults} on:input={() => isFormValid()} />
      </div>
      <div>
        <Label class="text-white mb-1">Number of children</Label>
        <Input type="number" min="0" bind:value={newPlace.children} on:input={() => isFormValid()} />
      </div>

      <div>
        <Label class="text-white mb-1">Are animals allowed?</Label>
        <Select items={animals} bind:value={newPlace.animals} placeholder="Are animals allowed?" on:change={() => isFormValid()}/>
      </div>
      <div>
        <Label class="text-white mb-1">Is there a parking?</Label>
        <Select items={parking} bind:value={newPlace.parking} placeholder="Is there a parking?" on:change={() => isFormValid()}/>
      </div>
      <div>
        <Label class="text-white mb-1">Minimum nights per reservation</Label>
        <Input type="number" min="1" bind:value={newPlace.minNight} on:input={() => isFormValid()} />
      </div>

      <div class="md:col-span-2 lg:col-span-2">
        <Textarea {...textareaprops} bind:value={newPlace.description} on:input={() => isFormValid()}/>
      </div>
    </div>
  </Card>
  
  
  <Card class="max-w-xl bg-berkeley-blue text-white shadow-2xl drop-shadow-lg border-2 border-sky-600">
      <h1 class="text-xl font-bold">Upload multiple images. At least n.</h1>

      <div class="mt-6 mb-6">
        <button class="bg-blue-500 text-white px-4 py-2 rounded" on:click={openFileInput}>
          Upload
        </button>
        <input type="file" id="image-upload" class="hidden" multiple bind:files on:change={handleFileUpload} on:change={() => isFormValid()}/>
      </div>
    
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-4">
        {#each imagePreviews as { id, src }, i (id)}
        <div class="relative group">
          <img src={src} alt={`Preview ${i}`} class="w-full h-32 object-cover rounded mb-2">
          <div
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            role="button"
            tabindex={0}
          >
            <button class="bg-white text-gray-800 p-2 rounded-full cursor-pointer" on:click={() => { removeImage(id); isFormValid(); }}>
              🗑️
            </button>
          </div>
        </div>
        {/each}
      </div>
  </Card>

  <Card class="max-w-xl bg-berkeley-blue text-white shadow-2xl drop-shadow-lg border-2 border-sky-600 mb-20">
    <h1 class="text-xl font-bold p-4">Choose the days when people will be able to make a reservation for your place: </h1>

    <div class="grid md:grid-cols-2 lg:grid-cols-2 mt-16">
        <div>
          <Input on:input={() => isFormValid()} type="text" id="datepicker" bind:value={selectedDate} placeholder="Click here to select a date" class="rounded-md w-15">
              <CalendarMonthSolid slot="left" />
          </Input>
        </div>
        <div class="mt-1 md:mt-0 lg:mt-0">
          <Input bind:value={dateInputs[0].price} placeholder="Price per night in €" class="w-48 h-10" on:input={handleInput}>
          </Input>
        </div>
        {#each dateInputs as { id, date, price } (id)}
          {#if id !== 1}
            <div class="mt-3 md:mt-0 lg:mt-0">
                <Input on:input={() => isFormValid()} type="text" id={`datepicker-${id}`} bind:value={date} placeholder="Click here to select a date" class="mt-2 w-15">
                    <CalendarMonthSolid slot="left" />
                </Input>
            </div>
            <div class="mt-1 md:mt-0 lg:mt-0">
              <Input bind:value={price} placeholder="Price per night in €" class="w-48 h-10" on:input={(event) => handleSecondInput(event, id)}>
              </Input>                                  
            </div>
          {/if}
        {/each}
    </div>

    <Button color="blue" on:click={() => {addDateInput(); isFormValid();}} class="mt-4" disabled={!isLastInputFilled}>Add more dates</Button>
    <p class="mt-5">Selected Dates: 
      {#if formattedDates.length > 0}
          {#each formattedDates as { date, price }, index (date)}
              {#if index !== 0}, {/if}
              {date} {#if price}for {price}€{/if}
          {/each}
      {/if}
    </p>

    <div class="items-center text-center">
      <Checkbox class="mt-14 text-white" color="blue" on:click={changeAgree}>By adding my place to the catalog I agree that it will be visible to other people.</Checkbox>
        {#if valid && agree}
          <Button href="/app" on:click={handleSubmit} color="blue" class="mt-8 w-56" disabled={!valid}>Add place</Button>
        {:else}
            <Button color="blue" class="mt-8 w-56" disabled={!valid || !agree}>Add place</Button>
        {/if}
    </div>
  </Card>
</div>

