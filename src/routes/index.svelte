<div class="hero bg-neutral text-neutral-content min-h-screen">
    <div class="hero-content mx-auto max-w-md text-center md:max-w-full">
        <div><h2 class="mt-20 mb-2 text-4xl font-extrabold md:text-6xl">Generate random assignments for negatives to
            runners</h2>
            <h3>This website is using <b><input bind:value={seed_text} class="input input-ghost input-xs"
                                                on:change={updateSeed}/></b> as a seed. The seed value gets randomized
                on every page load and cannot be changed and is only shown for reproducible results.</h3>
            <!-- Have two buttons to select the amount of slots, and the amount of assigned negatives -->
            <div class="mt-8">
                <div class="flex flex-row justify-center">
                    <div class="bg-secondary rounded-lg px-8 py-4 shadow-lg form-control w-full max-w-xs flex-column flex justify-between mx-4">
                        <label class="label">
                            <span class="label-text text-xl text-secondary-content">Enter the amount of total runners:</span>
                        </label>
                        <input bind:value={runners}
                               class="input input-bordered input-primary w-full max-w-xs input-lg" min="1" on:change={handleChange}
                               placeholder="Total runners" type="number"/>
                    </div>
                    <div class="bg-secondary rounded-lg px-8 py-4 shadow-lg form-control w-full max-w-xs flex-column flex justify-between mx-4">
                        <label class="label">
                            <span class="label-text text-xl text-secondary-content">Select the amount of negatives you want to assign. (Maximum {runners}
                                )</span>
                        </label>
                        <input bind:value={negatives}
                               class="input input-bordered input-primary w-full max-w-xs input-lg" max={runners} min="1"
                               on:change={handleChange} placeholder="Amount of negatives" type="number"/>
                    </div>
                </div>

                {#if inefficient}
                    <h4 class="mt-4 opacity-80">You have set very high values for the generation of the distribution.
                        This used algorithm is in no way optimized for high numbers, so it might be slow depending on
                        your machine. (And exponentially in any case)</h4>
                {/if}
            </div>


            <div class="mt-6 mb-10 flex w-full justify-center">
                <div class="tooltip tooltip-primary"
                     data-tip="A single dog should not have a negative twice in a row. If this toggle is enabled, any new random value which would be within a group of {multiples_of_n} which already has a negative will be discarded.">
                    <div class="form-control">
                        <label class="label cursor-pointer">
                            <span class="label-text">Prevent multiple negatives in a group of <input bind:value={multiples_of_n}
                                                                                                     class="input input-ghost input-xs p-0 w-3 remove-wheel"
                                                                                                     on:change={handleChange}
                                                                                                     type="number"/>.</span>
                            <input bind:checked={prevent_grouped_negatives} class="toggle toggle-primary ml-8"
                                   type="checkbox"/>
                        </label>
                    </div>
                </div>
            </div>

            <div class="mt-6 mb-10">
                <div class="flex flex-row justify-center">
                    <div class="flex justify-center mx-2" on:click={onPressGenerate}>
                        <div class="btn btn-primary btn-wide">Generate distribution</div>
                    </div>
                    {#if distributionHistory.length > 0}
                        <div class="tooltip tooltip-primary"
                             data-tip="This removes all currently generated distributions and additionally resets the seed to a new random value.">
                            <div class="flex justify-center mx-2" on:click={onClickClearDistributions}>
                                <div class="btn btn-primary btn-wide">Clear distributions</div>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>


            {#each distributionHistory as distribution, index}
                <div class="flex justify-items-center items-center">
                    <button class="btn btn-secondary no-animation btn-circle mr-3 hover:bg-secondary cursor-default">
                        {index + 1}
                    </button>
                    <div class="flex-1">
                        <DistributionDisplay distribution={distribution}/>
                    </div>

                </div>
            {/each}

            {#if distributionHistory.length > 0}
                <div class="flex justify-center mt-6" on:click={exportAsCSV}>
                    <div class="btn btn-primary btn-wide">Export as a CSV file</div>
                </div>
            {/if}

        </div>


    </div>
</div>

<script lang="ts">

  import {randomInt, seed, getState} from '@alisey/pcg32'
  import type {DistributionConfig} from "../types/main";
  import DistributionDisplay from "../components/DistributionDisplay.svelte";
  import {onMount} from "svelte";

  export const prerender = true;
  export const hydrate = true;

  let seed_value: BigInt
  let seed_text: string

  let runners = 30;
  let negatives = 5;

  let multiples_of_n = 3;

  let prevent_grouped_negatives = false;

  $: inefficient = runners >= 5000 && negatives >= 4000;

  let distributionHistory: DistributionConfig[] = [];

  // On change function resetting the values into correct ranges
  let handleChange = () => {
    if (runners < 1) {
      runners = 1;
    }
    if (negatives > runners) {
      negatives = runners;
    }
    if (negatives < 1) {
      negatives = 1;
    }

    if (multiples_of_n >= runners / negatives) {
      multiples_of_n = Math.floor(runners / negatives);
    }

    if (multiples_of_n <= 1) {
      prevent_grouped_negatives = false;
    }
  }

  let onPressGenerate = () => {
    const distribution = generateDistribution();

    distributionHistory = [...distributionHistory, distribution];
    console.log(distribution.distribution)
    console.log(distributionHistory)
  }

  let onClickClearDistributions = () => {
    distributionHistory = [];
    generateNewRandomSeed();
  }

  let updateSeed = () => {
    seed_value = BigInt(seed_text);
    seed(seed_value);
  }

  let generateNewRandomSeed = () => {
    seed_value = BigInt(Math.floor(Math.random() * 2 ** 53));
    seed_text = seed_value.toString();
    seed(seed_value);
  };

  // Generate random distribution of negatives
  let generateDistribution = () => {

    const currentDistribution: DistributionConfig = {
      runners: runners,
      negatives: negatives,
      seed: seed_value,
      internal_state: getState(),
      multiples_of_n: multiples_of_n,
      prevent_grouped_negatives: prevent_grouped_negatives,
      distribution: new Map(),
    };

    let assigned = 0;

    outer_loop:
      while (assigned < negatives) {
        let random_number = randomInt(runners);
        if (!currentDistribution.distribution.has(random_number)) {

          if (prevent_grouped_negatives && multiples_of_n > 1) {
            // Get the base for multiples of n for the current random number
            let base = random_number - random_number % multiples_of_n;

            // If any of the base numbers already exist, skip this random number and try again
            for (let i = 0; i < multiples_of_n; i++) {
              if (currentDistribution.distribution.has(base + i)) {
                continue outer_loop;
              }
            }
          }
          currentDistribution.distribution.set(random_number, assigned + 1);
          assigned++;
        }
      }
    return currentDistribution;
  }

  let exportAsCSV = () => {
    let csv = "";
    for (let i = 0; i < distributionHistory.length; i++) {
      let distribution = distributionHistory[i];
      let header = "";
      let row = "";
      for (let i = 1; i < distribution.runners + 1; i++) {
        header += `"${i}",`;
        row += `"${distribution.distribution.get(i) || ''}",`;
      }
      header += ",seed,runners,negatives,multiples_of_n,prevent_grouped_negatives, state\n";
      row += `,"${distribution.seed}","${distribution.runners}","${distribution.negatives}","${distribution.multiples_of_n}","${distribution.prevent_grouped_negatives}","${distribution.internal_state}"\n`;
      csv += header + row;
    }

    let blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});

    // Download link
    let downloadLink = document.createElement("a");
    downloadLink.download = "Exported Distributions.csv";
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  onMount(async () => {
    generateNewRandomSeed();
  })

</script>

<style>
    .remove-wheel::-webkit-inner-spin-button,
    .remove-wheel::-webkit-outer-spin-button {
        -webkit-appearance: none;
        -moz-appearance: textfield;
        margin: 0;
    }

</style>
