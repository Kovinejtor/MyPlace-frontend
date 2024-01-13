<script>
    import {Card, Button} from 'flowbite-svelte';
</script>

<div class="h-screen w-full flex justify-center items-center">
    <Card class="bg-berkeley-blue text-white">
        You curently don't have any of your own places in the catalog that other people can rent.
        <div class="items-center text-center">
            <Button href="/app/myPlaces/addingPlace" color="blue" class="mt-6 w-56">Add place</Button>
        </div>
    </Card>
</div>


