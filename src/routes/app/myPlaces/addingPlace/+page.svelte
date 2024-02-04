<script lang="ts">
    import {Card, Button, Label, Select, Input, Textarea, Fileupload, Listgroup, ListgroupItem, Checkbox  } from 'flowbite-svelte';
    import { onMount, afterUpdate  } from 'svelte';
    import { v4 as uuidv4 } from 'uuid';
    import { app, storage } from '../../../../firebase';
    import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
    import flatpickr from 'flatpickr';
    import 'flatpickr/dist/flatpickr.css';
    import {CalendarMonthSolid} from 'flowbite-svelte-icons';


  let selectedDate: string = "";
  let isLastInputFilled: boolean = false;
  let counter: number = 1;
  let dateInputs: { id: number; date: string }[] = [];

  const initializeFlatpickr = (selector: string, id: number) => {
    flatpickr(selector, {
      mode: "range",
      minDate: "today",
      dateFormat: 'd-m-Y',
      onChange: (selectedDates, dateStr) => {
        dateInputs = dateInputs.map(input => (input.id === id ? { ...input, date: dateStr } : input));
      },
    });
  };

  onMount(() => {
    initializeFlatpickr('#datepicker', 0);
  });

  const addDateInput = () => {
    const id = dateInputs.length + 1;
    dateInputs = [...dateInputs, { id, date: "" }];
    counter+=1;

    setTimeout(() => {
      const selector = `#datepicker-${id}`;
      initializeFlatpickr(selector, id);
    }, 0);
  };

  $: formattedDates = [selectedDate, ...dateInputs.map(dateInput => dateInput.date)];

  $: {
    isLastInputFilled = formattedDates.every(date => date !== '') && counter == formattedDates.length;
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
    price: "",
    description: "",
    folder: "",
    dates: "",
    images: [] as File[],
  };

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
      newPlace.dates = formattedDates.join(', ');
      console.log(newPlace.dates);

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
        newPlace.price.trim() !== "" &&
        newPlace.description.trim() !== "" &&
        newPlace.images.length >= 5 &&
        formattedDates[0] != ""
    ) {
        valid = true;
    }
    else{
        valid = false;
    }

    console.log(counter);
    console.log(formattedDates.length);
    console.log(formattedDates);
};

 function changeAgree(){
    agree = !agree;
 }
</script>
 

<div class=" flex justify-center items-center pt-10 pb-10 mt-14">
    <div class="bg-berkeley-blue text-white w-1/2 rounded-lg p-5">
        <p class="text-center mt-8 text-xl font-bold">If you want to add a place to the catalog you need to fill this form and accept the terms of service.</p>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 m-8 items-center text-center">
            <div class="items-center text-center">
                <Label>
                    <Select items={countries} bind:value={newPlace.type} placeholder="Type of place" on:change={() => isFormValid()}/>
                </Label>
            </div>
            <div class="items-center text-center ">
                <Input id="email" type="email" bind:value={newPlace.name} placeholder="Name for the place" on:input={() => isFormValid()}>
                </Input>
            </div>
            <div class="items-center text-cente">
                <Input id="email" type="email" bind:value={newPlace.country} placeholder="Country" on:input={() => isFormValid()}>
                </Input>
            </div>
            <div class="items-center text-cente">
                <Input id="email" type="email" bind:value={newPlace.city} placeholder="City" on:input={() => isFormValid()}>
                </Input>
            </div>
            <div class="items-center text-cente">
                <Input id="email" type="email" bind:value={newPlace.adress} placeholder="Adress" on:input={() => isFormValid()}>
                </Input>
            </div>
            <div>
                <form class="max-w-sm mx-auto relative">
                    <div class="relative">
                        <span class="text-gray-500 dark:text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2">Maximum number of people:</span>
                        <input type="number" id="number-input" bind:value={newPlace.maxPeople} aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-56 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="1" min="1" required>
                    </div>
                </form>
            </div>
            
            
            <div>
                <form class="max-w-sm mx-auto relative">
                    <div class="flex items-center">
                        <input type="number" id="number-input" bind:value={newPlace.beds} aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="1" min="1" required>
                        <span class="ml-2 text-gray-500 dark:text-gray-400 absolute ml-8">beds</span>
                    </div>
                </form>
            </div>
            <div>
                <form class="max-w-sm mx-auto relative">
                    <div class="flex items-center">
                        <input type="number" id="number-input" bind:value={newPlace.adults} aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="1" min="1" required>
                        <span class="ml-2 text-gray-500 dark:text-gray-400 absolute ml-8">adults</span>
                    </div>
                </form>
            </div>
            <div>
                <form class="max-w-sm mx-auto relative">
                    <div class="flex items-center">
                        <input type="number" id="number-input" bind:value={newPlace.children} aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0" min="0" required>
                        <span class="ml-2 text-gray-500 dark:text-gray-400 absolute ml-8">children</span>
                    </div>
                </form>
            </div>
            <div class="items-center text-center">
                <Label>
                    <Select items={animals} bind:value={newPlace.animals} placeholder="Are animals allowed?" on:change={() => isFormValid()}/>
                </Label>
            </div>
            <div class="items-center text-center">
                <Label>
                    <Select items={parking} bind:value={newPlace.parking} placeholder="Is there a parking?" on:change={() => isFormValid()}/>
                </Label>
            </div>
            <div>
                <form class="max-w-sm mx-auto relative">
                    <div class="flex items-center">
                        <input type="number" id="number-input" bind:value={newPlace.minNight} aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0" min="0" required>
                        <span class="ml-2 text-gray-500 dark:text-gray-400 absolute ml-8">Minimum nights per reservationq</span>
                    </div>
                </form>
            </div>
            <div class="items-center text-cente">
                <Input id="email" type="email" bind:value={newPlace.price} placeholder="Price per night" on:input={() => isFormValid()}>
                </Input>
            </div>
        </div>
        <div class="p-4">
            <span class="block text-lg font-semibold mb-4">
              Upload Multiple Images
            </span>
            <div class="mb-4">
              <button class="bg-blue-500 text-white px-4 py-2 rounded" on:click={openFileInput}>
                Upload
              </button>
              <input type="file" id="image-upload" class="hidden" multiple bind:files on:change={handleFileUpload} on:change={() => isFormValid()}/>
            </div>
          
            <div class="grid grid-cols-3 gap-4">
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
          </div>
        <Textarea {...textareaprops} bind:value={newPlace.description} on:input={() => isFormValid()}/>


          
          <h1 class="mt-10">Choose the days when people will be able to make a reservation:</h1>

          <Input on:input={() => isFormValid()} type="text" id="datepicker" bind:value={selectedDate} placeholder="Click here to select a date" class="rounded-md mt-4 mb-2 w-15">
            <CalendarMonthSolid slot="left"/>
          </Input>

          {#each dateInputs as { id, date } (id)}
            <Input on:input={() => isFormValid()} type="text" id={`datepicker-${id}`} bind:value={date} placeholder="Click here to select a date" class="mt-2 w-15">
              <CalendarMonthSolid slot="left"/>
            </Input>
          {/each}

          <Button color="blue" on:click={addDateInput} class="mt-4" disabled={!isLastInputFilled}>Add more dates</Button>
          <p class="mt-5">Selected Dates: {#each formattedDates as date, index (date)}
            {#if index !== 0}, {/if}{date}
          {/each}</p>




          
          

        <div class="items-center text-center">
            <Checkbox class="mt-14 text-white" color="blue" on:click={changeAgree}>By adding my place to the catalog I agree that it will be visible to other people.</Checkbox>
            {#if valid && agree}
               <Button href="/app" on:click={handleSubmit} color="blue" class="mt-8 w-56" disabled={!valid}>Add place</Button>
            {:else}
                <Button color="blue" class="mt-8 w-56" disabled={!valid || !agree}>Add place</Button>
            {/if}
        </div>
    </div>
</div>