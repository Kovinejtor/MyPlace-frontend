<script lang="ts">
  import { Label, Input, Card, Button, Helper, Select} from 'flowbite-svelte';
  import { EnvelopeSolid, LockSolid, MobilePhoneSolid, AddressCardSolid, MapPinAltSolid, UserSolid, EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';
  import '../../app.pcss';

  let show = false;
  let show1 = false;

 
  let genders = [
    { value: 'Male', name: 'Male' },
    { value: 'Female', name: 'Female' }
  ];

  let registrationData = {
  email: "",
  password: "",
  rePassword: "",
  gender: "", 
  firstName: "",
  lastName: "",
  country: "",
  phoneNumber: ""
  };

  
  function isValidEmail(email: string): boolean {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPassword(password: string): boolean {
    return password.length >= 8;
  }

  function isValidRepeatPassword(password: string): boolean {
    return password === registrationData.password;
  }

  function isValidPhone(phone: string): boolean {
    const phoneRegex: RegExp = /^[0-9\s]+$/;
    return phoneRegex.test(phone);
  }

  let emailInputTouched = false;
  let passwordInputTouched = false;
  let repeatPasswordInputTouched = false;
  let phoneInputTouched = false;

  function handleEmailInput() {
    emailInputTouched = true;
  }

  function handlePasswordInput() {
    passwordInputTouched = true;
  }

  function handleRepeatPasswordInput() {
    repeatPasswordInputTouched = true;
  }

  function handlePhoneInput() {
    phoneInputTouched = true;
  }

  let isButtonDisabled: boolean = true;

  function updateButtonStatus() {
    const isEmailValid = isValidEmail(registrationData.email);
  const isPasswordValid = isValidPassword(registrationData.password);
  const isRepeatPasswordValid = isValidRepeatPassword(registrationData.rePassword);
  const isPhoneValid = isValidPhone(registrationData.phoneNumber);

  const isEmptyValue = Object.values(registrationData).some(value => value === "");

  isButtonDisabled = isEmptyValue || !isEmailValid || !isPasswordValid || !isRepeatPasswordValid || !isPhoneValid;

  console.log(isButtonDisabled);
  console.log(registrationData);
  }

  const handleSubmit = () => {
    if (!isButtonDisabled) {
      window.location.href = '/app';
      createUser();
    }
  };


  const createUser = async () => {
    try {
      console.log("this", registrationData);
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
        sessionStorage.setItem('accessToken', JSON.stringify(result));
      } else {
        console.log("this", registrationData);
        console.error('Failed to create account:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };
  </script>
  
  
  <div class="bg-yale-blue grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 p-6 gap-7 justify-center items-center md:h-screen lg:h-screen">
    <div class="md:col-start-2 lg:col-start-2">
      <Card padding="xl" class="bg-berkeley-blue border-4 border-sky-600">
        <p class="mb-12 text-center font-bold text-3xl text-white">Register</p>
        <div class="mb-4">
          <Label class="block mb-2 text-white">Email address</Label>
          <Input
            id="email"
            bind:value={registrationData.email}
            placeholder="Enter your email address"
            on:input={() => { handleEmailInput(); updateButtonStatus(); }}
            class="border-2 border-sky-600"
          >
            <EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Input>
          {#if emailInputTouched && !isValidEmail(registrationData.email)}
            <Helper class="mt-2" color="red">
              <span class="font-medium">The email must be of a valid form.</span>
            </Helper>
          {/if}
        </div>

        <div class="mb-4">
          <Label class="block mb-2 text-white">Password</Label>
          <div class="relative">
            <Input id="password" type={show ? 'text' : 'password'} bind:value={registrationData.password} placeholder="Enter your password"
              on:input={() => { handlePasswordInput(); updateButtonStatus(); }}
              class="border-2 border-sky-600">
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
        
          {#if passwordInputTouched && !isValidPassword(registrationData.password)}
            <Helper class="mt-2" color="red">
              <span class="font-medium">The password is too short.</span>
            </Helper>
          {/if}
        </div>
        
        
        <div class="mb-4">
          <Label class="block mb-2 text-white">Repeat password</Label>
          <div class="relative">
            <Input id="rePassword" type={show1 ? 'text' : 'password'} bind:value={registrationData.rePassword} placeholder="Enter your password"
              on:input={() => { handleRepeatPasswordInput(); updateButtonStatus(); }}
              class="border-2 border-sky-600">
              <LockSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Input>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <button on:click={() => (show1 = !show1)}>
                {#if show1}
                  <EyeOutline class="w-6 h-6" />
                {:else}
                  <EyeSlashOutline class="w-6 h-6" />
                {/if}
              </button>
            </div>
          </div>
        
          {#if repeatPasswordInputTouched && !isValidRepeatPassword(registrationData.rePassword)}
            <Helper class="mt-2" color="red">
              <span class="font-medium">The password does not match.</span>
            </Helper>
          {/if}
        </div>

        <div class="mb-4">
          <Label class="block mb-2 text-white">
            Gender
            <Select class="mt-2 border-2 border-sky-600" items={genders} bind:value={registrationData.gender} on:change={updateButtonStatus}/>
          </Label>
        </div>
        
      </Card>
    </div>
    <div class="md:col-start-3 lg:col-start-3">
      <Card padding="xl" class="bg-berkeley-blue border-4 border-sky-600">
        <div class="mb-4">
          <Label class="block mb-2 text-white">First name</Label>
          <Input id="firstName" bind:value={registrationData.firstName} placeholder="Enter you first name" on:input={updateButtonStatus}
          class="border-2 border-sky-600">
            <AddressCardSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Input>
        </div>
        <div class="mb-4">
          <Label class="block mb-2 text-white">Last name</Label>
          <Input id="lastName" bind:value={registrationData.lastName} placeholder="Enter you last name" on:input={updateButtonStatus}
          class="border-2 border-sky-600">
            <AddressCardSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Input>
        </div>
        <div class="mb-4">
          <Label class="block mb-2 text-white">Country</Label>
          <Input id="country" bind:value={registrationData.country} placeholder="Enter you country name" on:input={updateButtonStatus}
          class="border-2 border-sky-600">
            <MapPinAltSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Input>
        </div>
        <div class="mb-12">
          <Label class="block mb-2 text-white">Phone number</Label>
          <Input id="phone" bind:value={registrationData.phoneNumber} placeholder="Enter you phone number" on:input={() => { handlePhoneInput(); updateButtonStatus(); }}
            class="border-2 border-sky-600">
            <MobilePhoneSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Input>
          {#if phoneInputTouched && !isValidPhone(registrationData.phoneNumber)}
            <Helper class="mt-2" color="red">
              <span class="font-medium">It must contain only numbers.</span>
            </Helper>
          {/if}
        </div>
        <Button on:click={handleSubmit} disabled={isButtonDisabled} type="submit" color="blue">Create account</Button>
      </Card>
    </div>
  </div> 