<script>
    import {Card, Button, Label, Select, Input, Textarea} from 'flowbite-svelte';
    import { Checkbox } from 'flowbite-svelte';
    import { EnvelopeSolid, LockSolid } from 'flowbite-svelte-icons';
    /** @type {any} */
    let selected;

    let countries = [
        { value: 'us', name: 'Apartment' },
        { value: 'ca', name: 'Villa' },
        { value: 'fr', name: 'Hotel' },
        { value: 'fr', name: 'Motel' },
        { value: 'fr', name: 'Hostel' },
        { value: 'fr', name: 'Resort' },
        { value: 'fr', name: 'Cabin' },
        { value: 'fr', name: 'Cottage' }
    ];

     /** @type {any} */
     let selectedAnimals;

    let animals = [
        { value: 'us', name: 'Yes' },
        { value: 'ca', name: 'No' }
    ];
      /** @type {any} */
    let selectedParking;

    let parking = [
        { value: 'us', name: 'Yes. It is free.' },
        { value: 'ca', name: 'Yes. You need to pay the parking.' },
        { value: 'ca', name: 'No.' },
    ];

    let textareaprops = {
    id: 'message',
    name: 'message',
    label: 'Your message',
    rows: 4,
    placeholder: 'Add a description for your place'
  };
</script>
 

<div class="h-screen w-full flex justify-center items-center">
    <div class="bg-berkeley-blue text-white w-1/2 rounded-lg p-5">
        <p class="text-center mt-8 text-xl font-bold">If you want to add a place to the catalog you need to fill this form and accept the terms of service.</p>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 m-8 items-center text-center">
            <div class="items-center text-center">
                <Label>
                    <Select items={countries} bind:value={selected} placeholder="Type of place"/>
                </Label>
            </div>
            <div class="items-center text-center ">
                <Input id="email" type="email" placeholder="Name for the place">
                </Input>
            </div>
            <div class="items-center text-cente">
                <Input id="email" type="email" placeholder="Country">
                </Input>
            </div>
            <div class="items-center text-cente">
                <Input id="email" type="email" placeholder="City">
                </Input>
            </div>
            <div class="items-center text-cente">
                <Input id="email" type="email" placeholder="Adress">
                </Input>
            </div>
            <div>
                <form class="max-w-sm mx-auto relative">
                    <div class="relative">
                        <span class="text-gray-500 dark:text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2">Maximum number of people:</span>
                        <input type="number" id="number-input" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-56 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="1" min="1" required>
                    </div>
                </form>
            </div>
            
            
            <div>
                <form class="max-w-sm mx-auto relative">
                    <div class="flex items-center">
                        <input type="number" id="number-input" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="1" min="1" required>
                        <span class="ml-2 text-gray-500 dark:text-gray-400 absolute ml-8">beds</span>
                    </div>
                </form>
            </div>
            <div>
                <form class="max-w-sm mx-auto relative">
                    <div class="flex items-center">
                        <input type="number" id="number-input" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="1" min="1" required>
                        <span class="ml-2 text-gray-500 dark:text-gray-400 absolute ml-8">adults</span>
                    </div>
                </form>
            </div>
            <div>
                <form class="max-w-sm mx-auto relative">
                    <div class="flex items-center">
                        <input type="number" id="number-input" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0" min="0" required>
                        <span class="ml-2 text-gray-500 dark:text-gray-400 absolute ml-8">children</span>
                    </div>
                </form>
            </div>
            <div class="items-center text-center">
                <Label>
                    <Select items={animals} bind:value={selectedAnimals} placeholder="Are animals allowed?"/>
                </Label>
            </div>
            <div class="items-center text-center">
                <Label>
                    <Select items={parking} bind:value={selectedParking} placeholder="Is there a parking?"/>
                </Label>
            </div>
            <div>
                <form class="max-w-sm mx-auto relative">
                    <div class="flex items-center">
                        <input type="number" id="number-input" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0" min="0" required>
                        <span class="ml-2 text-gray-500 dark:text-gray-400 absolute ml-8">Minimum nights per reservation</span>
                    </div>
                </form>
            </div>
            <div class="items-center text-cente">
                <Input id="email" type="email" placeholder="Price per night">
                </Input>
            </div>
        </div>
        <Textarea {...textareaprops} />
        <div class="items-center text-center">
            <Checkbox class="mt-14 text-white" color="blue" >By adding my place to the catalog I agree that it will be visible to other people.</Checkbox>
            <Button href="/app/myPlaces/addingPlace" color="blue" class="mt-8 w-56">Add place</Button>
        </div>
        
    </div>
</div>







