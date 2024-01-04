<script>
    import '../../app.pcss';
	import { page } from '$app/stores';
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, ImagePlaceholder, Skeleton, TextPlaceholder } from 'flowbite-svelte';
	$: activeUrl = $page.url.pathname;
  </script>
  
  <div class="relative px-8">
    <Navbar class="px-2 sm:px-4 py-2.5 fixed w-full z-20 top-0 start-0 border-b">
      <NavBrand href="/">
        <!--<img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />-->
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span>
      </NavBrand>
      <NavHamburger />
      <NavUl>
        <NavLi href="/" active={true}>Home</NavLi>
        <NavLi href="/">Register</NavLi>
        <NavLi href="/">Log out</NavLi>
      </NavUl>
    </Navbar>
  </div>

  <div class="flex px-4 mx-auto w-full">
	<main class="lg:ml-72 w-full mx-auto">
		<slot />
	</main>
</div>

 

  
  
  
  