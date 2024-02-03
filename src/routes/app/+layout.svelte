<script>
    import '../../app.pcss';
	import { page } from '$app/stores';
    import { Navbar, NavBrand, NavLi, NavUl, Card, NavHamburger, ImagePlaceholder, Skeleton, TextPlaceholder } from 'flowbite-svelte';
	$: activeUrl = $page.url.pathname;
  </script>
  
  <div class="relative px-8 bg-berkeley-blue">
    <Navbar class="px-2 sm:px-4 py-2.5 fixed w-full z-20 top-0 start-0 border-b bg-oxford-blue text-white">
      <NavBrand>
        <!--<img src="src/lib/assets/nav.png" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />-->
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">MyPlace</span>
      </NavBrand>
      <NavHamburger />
      <NavUl>
        <NavLi href="/app" active={true}  class="text-white">Home</NavLi>
        <NavLi href="/app/myPlaces"  class="text-white">My Places</NavLi>
        <NavLi href="/app/journeyLog"  class="text-white">Journey Log</NavLi>
        <NavLi href="/app/account"  class="text-white">Account</NavLi>
        <NavLi href="/"  class="text-white">Log out</NavLi>
      </NavUl>
    </Navbar>
  </div>

  <div class="flex px-4 min-h-screen w-full bg-yale-blue">
    <main class="w-full mx-auto h-full">
      <slot />
    </main>
  </div>

  
  

 

  
  
  
  