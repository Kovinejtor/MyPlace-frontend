<script lang="ts">
  import { Label, Input } from 'flowbite-svelte';
  import { Card } from 'flowbite-svelte';
  import { Button } from 'flowbite-svelte';
  import { EnvelopeSolid, LockSolid, EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';
  import '../app.pcss';
  
  let logInData = {
  email: "",
  password: ""
  };

  let emailForReset: string;

  let loginErrorMessage: string = '';
  let loginErrorMessageTwo: string = '';
  let show = false;
  let loginError: boolean = true;

  const checkLogin = async () => {
  // Check if email and password are provided
  if (!logInData.email || !logInData.password) {
    console.error('Email and password are required');
    loginErrorMessage = 'Email and password are required';
    loginError = false;
    return;
  }

  try {
    const url = new URL('http://127.0.0.1:8000/login/');
    url.searchParams.append('email', logInData.email);
    url.searchParams.append('password', logInData.password);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Logged in successfully:', result);
      sessionStorage.setItem('accessToken', JSON.stringify(result));

      loginError = true;
    } else {
      console.error('Failed to log in:', response.statusText);
      loginErrorMessageTwo = 'Wrong email and/or password';
      loginError = false;
    }
  } catch (error) {
    console.error('Error logging in:', error);
    loginError = false;
  }
};


const handleSubmit = async () => {
  await checkLogin();
  console.log(loginError);

  if (loginError) {
    window.location.href = 'app'; 
  }
};


const openDialogForPasswordReset = async () => {
  const myDialog = document.getElementById('myDialog') as HTMLDialogElement;
  myDialog.showModal();
}

const clearInputInDialog = async () => {
  emailForReset = "";
}

const closeDialogForPasswordReset = async () => {
  const myDialog = document.getElementById('myDialog') as HTMLDialogElement;
  myDialog.close();    
}

const resetPassword = async () => {
  console.log(emailForReset);
}
</script>


<div class="h-screen bg-berkeley-blue w-full flex justify-center items-center">
    <div class="mr-8 hidden md:block lg:block"> <!--needs at least a 766*y resolution so the image would be visible-->
      <img src="/main.jpg" class="object-cover h-96 w-100 rounded-lg" alt="product 1"/>
    </div>
    
    <Card padding="xl">
      <p class="mb-12 text-center font-bold text-black text-2xl">Log in</p>
      <div class="mb-4">
        <Label for="default-input" class="block mb-2">Email address</Label>
        <Input id="default-input" bind:value={logInData.email} placeholder="Enter you email address">
          <EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Input>
      </div>
      <div class="mb-4">
        <Label class="block mb-2">Password</Label>
        <div class="relative">
          <Input id="password" type={show ? 'text' : 'password'} bind:value={logInData.password} placeholder="Enter your password">
            <LockSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Input>
          
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <button on:click={() => (show = !show)}>
              {#if show}
                <EyeOutline class="w-6 h-6" />
              {:else}
                <EyeSlashOutline class="w-6 h-6" />
              {/if}
            </button>
          </div>
        </div>
      </div>
      
  
      <Button on:click={handleSubmit} type="submit" color="blue">Log in</Button>
      {#if !logInData.password && loginErrorMessage}
        <p class="text-red-500 mt-2">{loginErrorMessage}</p>
      {/if}
      {#if logInData.password && loginErrorMessageTwo}
        <p class="text-red-500 mt-2">{loginErrorMessageTwo}</p>
      {/if}
      <a href="register" class="mt-6 font-medium text-blue-600 text-center dark:text-blue-500 hover:underline">Don't have an account. Register</a>

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <a role="button" tabindex="0" on:click={openDialogForPasswordReset} class="mt-3 font-medium text-blue-600 text-center dark:text-blue-500 hover:underline">Forgot the password?</a>
    </Card>
</div>

<dialog id="myDialog" class="rounded-lg">
  <div class="grid grid-rows-2 gap-4 p-4">
    <div>
      <Input id="resset-password-input" size="lg" placeholder="Enter the e-mail" bind:value={emailForReset}/>
    </div>
    <div>
      <Button on:click={resetPassword} color="blue">Resset password</Button>
      <Button on:click={clearInputInDialog} color="purple">Clear input</Button>
      <Button on:click={closeDialogForPasswordReset} color="red">Close</Button>    
    </div>
  </div>
</dialog>
