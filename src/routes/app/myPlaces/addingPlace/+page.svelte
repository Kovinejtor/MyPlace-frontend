<script lang="ts">
    import {Card, Button, Label, Select, Input, Textarea, Fileupload, Listgroup, ListgroupItem, Checkbox  } from 'flowbite-svelte';

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

  let imagePreviews: { id: number; src: string }[] = [];

  function handleFileUpload() {
  if (files) {
    const newPreviews = Array.from(files).map((file, i) => ({
      id: imagePreviews.length + i,
      src: URL.createObjectURL(file),
    }));

    imagePreviews = [...imagePreviews, ...newPreviews];

    newPlace.images = [...newPlace.images, ...Array.from(files)] as File[];
  }
}

  function removeImage(id: number) {
    imagePreviews = imagePreviews.filter((img) => img.id !== id);
  }

  function openFileInput() {
    const fileInput = document.getElementById('image-upload');
    fileInput?.click();
  }

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
    images: [] as File[],
  };

  const addPlace = async () => {
    try {
        const formData = new FormData();
        formData.append('newPlace', JSON.stringify(newPlace));

        newPlace.images.forEach((file, index) => {
            formData.append(`image${index}`, file); // Ensure 'file' is a valid File object
        });

        console.log(newPlace);

        const response = await fetch('http://127.0.0.1:8000/addPlace/', {
            method: 'POST',
            body: formData, // No Content-Type header needed
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Place added successfully:', result);
        } else {
            console.error('Failed to add place:', response.statusText);
        }
    } catch (error) {
        console.error('Error adding place:', error);
    }
};

  const handleSubmit = () => {
    addPlace();
  };
</script>
 

<div class="h-screen w-full flex justify-center items-center">
    <div class="bg-berkeley-blue text-white w-1/2 rounded-lg p-5">
        <p class="text-center mt-8 text-xl font-bold">If you want to add a place to the catalog you need to fill this form and accept the terms of service.</p>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 m-8 items-center text-center">
            <div class="items-center text-center">
                <Label>
                    <Select items={countries} bind:value={newPlace.type} placeholder="Type of place"/>
                </Label>
            </div>
            <div class="items-center text-center ">
                <Input id="email" type="email" bind:value={newPlace.name} placeholder="Name for the place">
                </Input>
            </div>
            <div class="items-center text-cente">
                <Input id="email" type="email" bind:value={newPlace.country} placeholder="Country">
                </Input>
            </div>
            <div class="items-center text-cente">
                <Input id="email" type="email" bind:value={newPlace.city} placeholder="City">
                </Input>
            </div>
            <div class="items-center text-cente">
                <Input id="email" type="email" bind:value={newPlace.adress} placeholder="Adress">
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
                    <Select items={animals} bind:value={newPlace.animals} placeholder="Are animals allowed?"/>
                </Label>
            </div>
            <div class="items-center text-center">
                <Label>
                    <Select items={parking} bind:value={newPlace.parking} placeholder="Is there a parking?"/>
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
                <Input id="email" type="email" bind:value={newPlace.price} placeholder="Price per night">
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
              <input type="file" id="image-upload" class="hidden" multiple bind:files on:change={handleFileUpload} />
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
                  <button class="bg-white text-gray-800 p-2 rounded-full cursor-pointer" on:click={() => removeImage(id)}>
                    🗑️
                  </button>
                </div>
              </div>
              {/each}
            </div>
          </div>
        <Textarea {...textareaprops} bind:value={newPlace.description}/>
        <div class="items-center text-center">
            <Checkbox class="mt-14 text-white" color="blue" >By adding my place to the catalog I agree that it will be visible to other people.</Checkbox>
            <Button href="/app/myPlaces/addingPlace" on:click={handleSubmit} color="blue" class="mt-8 w-56">Add place</Button>
        </div>

    </div>
</div>