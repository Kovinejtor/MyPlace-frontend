<script>
  import { Label, Input } from 'flowbite-svelte';
  import { Card } from 'flowbite-svelte';
  import { Button } from 'flowbite-svelte';
  import '../../app.pcss';

  /*
    #134074
    #13315C
    #0B2545
    #FFFFFF
  */

  let registrationData = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  country: "",
  phoneNumber: ""
  };

  const createUser = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Account created successfully:', result);
      } else {
        console.error('Failed to create account:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const handleSubmit = () => {
    createUser();
  };
  </script>
  
  
  <div class="mt-10 mb-10 bg-gray w-full flex justify-center items-center">
      <Card padding="xl">
        <h5 class="mb-12 text-center">Register</h5>
        <div class="mb-4">
          <Label class="block mb-2">Email address</Label>
          <Input id="email" bind:value={registrationData.email} placeholder="Enter you email address" />
        </div>
        <div class="mb-4">
          <Label class="block mb-2">Password</Label>
          <Input id="password" bind:value={registrationData.password} placeholder="Enter you password" />
        </div>
        <div class="mb-4">
          <Label class="block mb-2">Repeat password</Label>
          <Input id="rePassword" placeholder="Repeat your password" />
        </div>
        <div class="mb-4">
          <Label class="block mb-2">First name</Label>
          <Input id="firstName" bind:value={registrationData.firstName} placeholder="Enter you first name" />
        </div>
        <div class="mb-4">
          <Label class="block mb-2">Last name</Label>
          <Input id="lastName" bind:value={registrationData.lastName} placeholder="Enter you last name" />
        </div>
        <div class="mb-4">
          <Label class="block mb-2">Country</Label>
          <Input id="country" bind:value={registrationData.country} placeholder="Enter you country name" />
        </div>
        <div class="mb-12">
          <Label class="block mb-2">Phone number</Label>
          <Input id="phone" bind:value={registrationData.phoneNumber} placeholder="Enter you phone number" />
        </div>
        
        <Button href="/app" on:click={handleSubmit} type="submit" color="blue">Create account</Button>
      </Card>
  </div>
  
  
  
  
  
  
  