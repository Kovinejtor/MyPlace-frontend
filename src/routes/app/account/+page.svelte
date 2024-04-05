<script lang="ts">
    import { onMount} from 'svelte';
    import { Label, Input, Card, Button, Helper, Select} from 'flowbite-svelte';

    let userData = {
        userEmail: "",
        userGender: "", 
        userFirstName: "",
        userLastName: "",
        userCountry: "",
        userPhoneNumber: ""
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
</script>

<div class="flex justify-center items-center" >
    <Card class="bg-berkeley-blue grid grid-rows-3 ">
        <div class="text-4xl font-bold text-center text-white">
            <h1>
                Info about your account
            </h1>
        </div>
        <div class="grid grid-rows-3 grid-flow-col">
            <div class="bg-oxford-blue rounded-lg">
                <p class="font-bold">Your email:</p> 
                <p>{userData.userEmail}</p>
            </div>
            <div class="bg-oxford-blue rounded-lg">
                <p class="font-bold">Your first name:</p> 
                <p>{userData.userFirstName}</p>
            </div>
            <div class="bg-oxford-blue rounded-lg">
                <p class="font-bold">Your last name:</p> 
                <p>{userData.userLastName}</p>
            </div>
            <div class="bg-oxford-blue rounded-lg">
                <p class="font-bold">Your gender:</p> 
                <p>{userData.userGender}</p>
            </div>
            <div class="bg-oxford-blue rounded-lg">
                <p class="font-bold">Your country:</p> 
                <p>{userData.userCountry}</p>

            </div>
            <div class="bg-oxford-blue rounded-lg">
                <p class="font-bold">Your phone number:</p> 
                <p>{userData.userPhoneNumber}</p>
            </div>
        </div>
        <div>
            <Button color="red" href="/" on:click={deleteAccount}>
                Delete account
            </Button>
        </div>
    </Card>
</div>