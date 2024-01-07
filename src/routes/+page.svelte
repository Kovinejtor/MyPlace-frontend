<script>
  import { Label, Input } from 'flowbite-svelte';
  import { Card } from 'flowbite-svelte';
  import { Button } from 'flowbite-svelte';
  import { EnvelopeSolid, LockSolid } from 'flowbite-svelte-icons';
  import '../app.pcss';
  
  /*
    #134074
    #13315C
    #0B2545
    #FFFFFF
  */

  let logInData = {
  email: "",
  password: ""
  };

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
      } else {
        console.error('Failed to log in:', response.statusText);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleSubmit = () => {
    checkLogin();
  };
</script>


<div class="h-screen bg-berkeley-blue w-full flex justify-center items-center">
    <div class="mr-8">
      <img src="/src/lib/assets/main.jpg" class="object-cover h-96 w-100 rounded-lg" alt="product 1"/>
    </div>
    
    <Card padding="xl">
      <p class="mb-12 text-center font-bold text-black text-2xl">Log in</p>
      <div class="mb-4">
        <Label for="default-input" class="block mb-2">Email address</Label>
        <Input id="default-input" bind:value={logInData.email} placeholder="Enter you email address">
          <EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Input>
      </div>
      <div class="mb-12">
        <Label for="default-input" class="block mb-2">Password</Label>
        <Input id="default-input" bind:value={logInData.password} placeholder="Enter your password">
          <LockSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Input>
      </div>
  
      <Button href="app" on:click={handleSubmit} type="submit" color="blue">Log in</Button>

      <a href="register" class="mt-5 font-medium text-blue-600 dark:text-blue-500 hover:underline">Register</a>
    </Card>
</div>








