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

  let show = false;
  let loginError: boolean = true;

  const checkLogin = async () => {
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
        // If login is successful, you can perform navigation here
      } else {
        console.error('Failed to log in:', response.statusText);
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
    // Only navigate if there is no login error
    if (loginError) {
      window.location.href = 'app'; // or use Svelte's router for navigation
    }
  };
</script>


<div class="h-screen bg-berkeley-blue w-full flex justify-center items-center">
    <div class="mr-8">
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

      <a href="register" class="mt-6 font-medium text-blue-600 text-center dark:text-blue-500 hover:underline">Don't have an account. Register</a>
      <p class="mt-3 font-medium text-blue-600 text-center dark:text-blue-500 hover:underline">Forgot the password?</p>
    </Card>
</div>