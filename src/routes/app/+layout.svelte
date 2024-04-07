<script lang="ts">
    import '../../app.pcss';
	import { page } from '$app/stores';
    import { Navbar, NavBrand, NavLi, NavUl, Card, NavHamburger, ImagePlaceholder, Skeleton, TextPlaceholder } from 'flowbite-svelte';
	$: activeUrl = $page.url.pathname;

  const logout = () => {
    
        sessionStorage.removeItem('accessToken');

        if (!sessionStorage.getItem('accessToken')) {
            console.log('Access token removed successfully');
            //window.location.href = '/';  
        } else {
            console.log('Failed to remove access token');
        }
    };
  </script>
  
  <div class="relative px-8 bg-berkeley-blue">
    <Navbar class="px-2 sm:px-4 py-2.5 fixed w-full z-20 top-0 start-0 border-b bg-oxford-blue text-white">
      <NavBrand>
        <img src="/favicon.png" alt="Flowbite Logo" class="mr-5" />
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">MyPlace</span>
      </NavBrand>
      <NavHamburger />
      <NavUl>
        <NavLi href="/app" active={true}  class="text-white bg-oxford-blue md:mt-0 lg:mt-0 mt-1">Home</NavLi>
        <NavLi href="/app/myPlaces"  class="text-white bg-oxford-blue md:mt-0 lg:mt-0 mt-1">My Places</NavLi>
        <NavLi href="/app/journeyLog"  class="text-white bg-oxford-blue md:mt-0 lg:mt-0 mt-1">Journey Log</NavLi>
        <NavLi href="/app/account"  class="text-white bg-oxford-blue md:mt-0 lg:mt-0 mt-1">Account</NavLi>
        <NavLi href="/" on:click={() => logout()} class="text-white bg-oxford-blue md:mt-0 lg:mt-0 mt-1">Log out</NavLi>
      </NavUl>
    </Navbar>
  </div>

  <div class="flex px-4 min-h-screen w-full bg-yale-blue">
    <main class="w-full mx-auto h-full">
      <slot />
    </main>
  </div>