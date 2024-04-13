<script lang="ts">
    import { onMount} from 'svelte';
    import flatpickr from 'flatpickr';
    import 'flatpickr/dist/flatpickr.css';
	import type { Instance } from 'flatpickr/dist/types/instance';



    onMount(() => {
        const fp = flatpickr(`#mainDiv`, {
            onDayCreate: function(dObj, dStr, fp, dayElem){
                
                if(dayElem.ariaLabel == "May 10, 2024"){
                    dayElem.innerHTML += "<span class='absolute top-4 left-4 text-[10px]'>123&</span>";
                }
                console.log(dayElem);
            }
        });
        
    });

    function doSomething(){
        //console.log(fp.currentYear());
    }
</script>

<div class="justify-center items-center mt-[800px]">
    <input id="mainDiv" placeholder="Enter date">
    <button on:click={doSomething}>HEJ</button>
</div>


