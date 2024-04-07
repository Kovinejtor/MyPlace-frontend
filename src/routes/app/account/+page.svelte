<script lang="ts">
    import { onMount} from 'svelte';
    import {Button, Checkbox} from 'flowbite-svelte';

    let userData = {
        userEmail: "",
        userGender: "", 
        userFirstName: "",
        userLastName: "",
        userCountry: "",
        userPhoneNumber: ""
    };

    let checkboxValue:boolean;

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
                const userEmail = result;
                userData.userEmail = result;

                console.log(userEmail);

                const userInfoResponse = await fetch(`http://127.0.0.1:8000/user-info/${userEmail}`);
                if (userInfoResponse.ok) {
                    const userInfo = await userInfoResponse.json();
                    userData.userGender = userInfo.gender;
                    userData.userFirstName = userInfo.firstName;
                    userData.userLastName = userInfo.lastName;
                    userData.userCountry = userInfo.country;
                    userData.userPhoneNumber = userInfo.phoneNumber;
                    console.log(userData);
                } else {
                    console.error('Failed to fetch user information:', userInfoResponse.statusText);
                }
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


    async function deleteAccount() {
            const accessTokenString = sessionStorage.getItem('accessToken');

            if (accessTokenString) {
                const accessToken = JSON.parse(accessTokenString);
                const access_token = accessToken?.access_token;

                try {
                    const response = await fetch('http://127.0.0.1:8000/delete-account/', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${access_token}`
                        },
                    });

                    if (response.ok) {
                        const result = await response.json();
                        console.log(result.message);
                        sessionStorage.removeItem('accessToken');

                        if (!sessionStorage.getItem('accessToken')) {
                            console.log('Access token removed successfully'); 
                        } else {
                            console.log('Failed to remove access token');
                        }
                        
                    } else {
                        console.error('Failed to delete account:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error deleting account:', error);
                }
            } else {
                console.error('Access token not found in sessionStorage.');
            }
    }


    const openDialogForAccountDelete = async () => {
        const myDialog = document.getElementById('myDialog') as HTMLDialogElement;
        myDialog.showModal();

        const mainDiv = document.getElementById('mainDiv');
        if (mainDiv) {
            mainDiv.classList.add('blur-lg');
        }
        }

    const closeDialogForAccountDelete = async () => {
        const myDialog = document.getElementById('myDialog') as HTMLDialogElement;
        myDialog.close(); 
        
        const mainDiv = document.getElementById('mainDiv');
        if (mainDiv) {
            mainDiv.classList.remove('blur-lg');
        }
    }
</script>

<div id="mainDiv" class="flex justify-center items-center">
    <div class="bg-berkeley-blue grid grid-rows-5 md:grid-rows-4 lg:grid-rows-4 rounded-lg p-10 text-white mt-24 mb-8 shadow-2xl drop-shadow-lg border-2 border-sky-600">
        <div class="row-span-1 md:row-span-1 lg:row-span-1 text-4xl font-bold text-center mt-7 h-32">
            <h1>
                Info about your account
            </h1>
        </div>
        <div class="row-span-3 md:row-span-2 lg:row-span-2 grid grid-rows-6 md:grid-rows-3 lg:grid-rows-3 grid-flow-col gap-5">
            <div class="bg-oxford-blue rounded-lg p-3 drop-shadow-lg border-2 border-sky-800">
                <p class="font-bold">Your email:</p> 
                <p>{userData.userEmail}</p>
            </div>
            <div class="bg-oxford-blue rounded-lg p-3 drop-shadow-lg border-2 border-sky-800">
                <p class="font-bold">Your first name:</p> 
                <p>{userData.userFirstName}</p>
            </div>
            <div class="bg-oxford-blue rounded-lg p-3 drop-shadow-lg border-2 border-sky-800">
                <p class="font-bold">Your last name:</p> 
                <p>{userData.userLastName}</p>
            </div>
            <div class="bg-oxford-blue rounded-lg p-3 drop-shadow-lg border-2 border-sky-800">
                <p class="font-bold">Your gender:</p> 
                <p>{userData.userGender}</p>
            </div>
            <div class="bg-oxford-blue rounded-lg p-3 drop-shadow-lg border-2 border-sky-800">
                <p class="font-bold">Your country:</p> 
                <p>{userData.userCountry}</p>

            </div>
            <div class="bg-oxford-blue rounded-lg p-3 drop-shadow-lg border-2 border-sky-800">
                <p class="font-bold">Your phone number:</p> 
                <p>{userData.userPhoneNumber}</p>
            </div>
        </div>
        <div class="row-span-1 md:row-span-1 lg:row-span-1 flex justify-center items-center h-auto">
            <Button color="red" on:click={openDialogForAccountDelete} class="border-black">
                Delete account
            </Button>
        </div>
    </div>
</div>

<dialog id="myDialog" class="rounded-lg bg-berkeley-blue border-2 border-sky-500">
    <div class="grid grid-rows-2 gap-4 p-4">
      <div>
        <Checkbox class="text-white font-bold" bind:checked={checkboxValue}>I understand that deleting my account will permanently remove all of my data and cannot be undone</Checkbox>
      </div>
      <div>
        <Button disabled={!checkboxValue} on:click={deleteAccount} href="/" color="red">Delete account</Button>
        <Button on:click={closeDialogForAccountDelete} color="blue">Close</Button>    
      </div>
    </div>
  </dialog>