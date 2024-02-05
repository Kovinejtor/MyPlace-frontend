<script lang="ts">
    import {Card, Button} from 'flowbite-svelte';
    import { onMount, afterUpdate  } from 'svelte';

    onMount(() => {
        check();
        
    });

    let userEmail : string = "";
    let count : number;

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
                const result = await response.json();
                console.log('All places for current user:', result);
            } else {
                console.error('Failed to fetch places for current user:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching places for current user:', error);
        }
    }
</script>


<div class="grid grid-rows-6 h-screen w-full mt-8 p-4 grid-flow-col flex justify-center items-center">
    <div class="flex row-span-3 justify-center items-center">
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
    <div class="flex row-span-1 justify-center items-center">
        <Card class="bg-berkeley-blue text-white">
            
        </Card>
    </div>
</div>