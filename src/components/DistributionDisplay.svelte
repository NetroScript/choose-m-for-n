<div class="overflow-x-auto mt-3">
    <table class="table text-center">
        <thead>
        <tr>
            {#each Array(distribution.runners) as _, i}
                <th
                class:nth="{distribution.prevent_grouped_negatives && i % distribution.multiples_of_n === 0 && i !== 0}"
                > {i + 1}</th>
            {/each}

        </tr>
        </thead>
        <tbody>
        <tr>
            {#each Array(distribution.runners) as _, i}
                {#if distribution.distribution.has(i)}
                    <td class="bg-primary-focus"
                        class:nth="{distribution.prevent_grouped_negatives && i % distribution.multiples_of_n === 0 && i !== 0}"
                    >{distribution.distribution.get(i)}</td>
                {:else}
                    <td
                            class:nth="{distribution.prevent_grouped_negatives && i % distribution.multiples_of_n === 0 && i !== 0}"
                    ></td>
                {/if}
            {/each}
        </tr>
        </tbody>
    </table>
</div>

<script lang="ts">

    import type {DistributionConfig} from "../types/main";

    export let distribution: DistributionConfig;

</script>

<style>
    .nth {
        border-left: 2px solid rgba(255, 255, 255, 0.2);
    }
</style>
