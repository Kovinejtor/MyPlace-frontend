<script lang="ts">
  import { Label, Input, Card, Button } from 'flowbite-svelte';
  import { EnvelopeSolid, LockSolid, EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';
  import '../app.pcss';
  
  let logInData = {
    email: "",
    password: ""
  };

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
</script>


<div class="h-screen bg-yale-blue w-full flex justify-center items-center">
    <div class="mr-8 hidden md:block lg:block">
      <img src="/main.jpg" class="object-cover h-96 w-100 rounded-lg border-4 border-sky-600" alt="product 1"/>
    </div>
    
    <Card padding="xl" class="bg-berkeley-blue border-4 border-sky-600">
      <p class="mb-12 text-center font-bold text-3xl text-white">Log in</p>
      <div class="mb-4">
        <Label for="default-input" class="block mb-2 text-white">Email address</Label>
        <Input id="default-input" bind:value={logInData.email} placeholder="Enter you email address" class="border-2 border-sky-600">
          <EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Input>
      </div>
      <div class="mb-4">
        <Label class="block mb-2 text-white">Password</Label>
        <div class="relative">
          <Input id="password" type={show ? 'text' : 'password'} bind:value={logInData.password} placeholder="Enter your password" class="border-2 border-sky-600">
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
      <a href="register" class="mt-6 font-medium text-white text-center hover:underline">Don't have an account. Register</a>
    </Card>
</div>