<div class="hero bg-neutral text-neutral-content min-h-screen">
    <div class="hero-content mx-auto max-w-full text-center overflow-hidden">
        <div class="max-w-full">
            <h2 class="mt-20 mb-2 text-4xl font-extrabold md:text-6xl">
                Generate m random assignments for n possible choices
            </h2>
            <h3>
                This website is using
                <input bind:value={seed_text} class="input input-ghost input-xs border-0 border-b-2 border-primary" on:change={updateSeed}/>
                as a seed. The seed value gets randomized on every page load and cannot be changed and is only shown for
                reproducible results.
            </h3>
            <!-- Have two buttons to select the amount of slots, and the amount of assigned assignments -->
            <div class="mt-8">
                <div class="flex flex-col md:flex-row justify-center items-center place-items-center">
                    <div class="bg-secondary rounded-lg px-8 py-4 shadow-lg form-control w-full max-w-md flex-column flex justify-between items-center place-items-center m-4">
                        <label class="label">
                            <span class="label-text text-xl text-secondary-content">Enter the amount of total choices:</span>
                        </label>
                        <input bind:value={choices}
                               class="input input-bordered input-primary w-full max-w-md input-lg" min="1"
                               on:change={handleChange}
                               placeholder="Total choices" type="number"/>
                    </div>
                    <div class="bg-secondary rounded-lg px-8 py-4 shadow-lg form-control w-full max-w-md flex-column flex justify-between items-center place-items-center m-4">
                        <label class="label">
                            <span class="label-text text-xl text-secondary-content">Select the amount of possible assignments. (Maximum {choices}
                                )</span>
                        </label>
                        <input bind:value={assignments}
                               class="input input-bordered input-primary w-full max-w-md input-lg" max={choices} min="1"
                               on:change={handleChange} placeholder="Amount of assignments" type="number"/>
                    </div>
                </div>

                {#if inefficient}
                    <h4 class="mt-4 opacity-80">You have set very high values for the generation of the distribution.
                        This will still work, but was not optimized for it.</h4>
                {/if}
            </div>

            <div class="mt-6 mb-10 flex w-full justify-center">
                <div class="tooltip tooltip-primary"
                     data-tip="This is for the use case that if you for example assign tasks to a user, that a single user should not have more than one task. If this toggle is enabled, any new random value which would be within a group of {multiples_of_n} which already has an assignment will be discarded.">
                    <div class="form-control">
                        <label class="label cursor-pointer">
                            <span class="label-text">Prevent multiple assignments in a group of <input
                                    bind:value={multiples_of_n}
                                    class="input input-ghost input-xs p-0 w-3 remove-wheel border-0 border-b-2 border-primary"
                                    on:change={handleChange}
                                    type="number"/> choices.</span>
                            <input bind:checked={prevent_grouped_assignments} class="toggle toggle-primary ml-8"
                                   type="checkbox"/>
                        </label>
                    </div>
                </div>
            </div>

            <div class="tooltip tooltip-primary"
                 data-tip="Algorithm 1 is a simpler, but a bit slower algorithm [For smaller numbers the difference in speed between both algorithms is negligent]. You just randomly keep drawing numbers in the range of 0-(n-1) and discard every newly generated number, if it does not fit the requirements. Algorithm 2 generates a list with all possible values. It then randomly selects a value from that list, checks if it is valid, if this is the case uses that value and removes it from the list of possible values. If it is not valid, it just picks a new random array element.">
                <div class="form-control">
                    <label class="label cursor-pointer">
                        <span class="label-text">Algorithm 1.</span>
                        <input bind:checked={use_array_based_algorithm}
                               class="toggle toggle-primary mx-8 bg-primary border-primary"
                               type="checkbox"/>
                        <span class="label-text">Algorithm 2.</span>
                    </label>
                </div>
            </div>

            <div class="mt-6 mb-10">
                <div class="flex flex-col md:flex-row justify-center ">
                    <div class="flex justify-center m-2" on:click={onPressGenerate}>
                        <div class="btn btn-primary btn-wide">Generate distribution</div>
                    </div>
                    {#if show_debug_info}
                        <div class="flex justify-center m-2" on:click={benchmark}>
                            <div class="btn btn-primary btn-wide">Benchmark</div>
                        </div>
                    {/if}
                    {#if distributionHistory.length > 0}
                        <div class="tooltip tooltip-primary"
                             data-tip="This removes all currently generated distributions and additionally resets the seed to a new random value.">
                            <div class="flex justify-center m-2" on:click={onClickClearDistributions}>
                                <div class="btn btn-primary btn-wide">Clear distributions</div>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>

            {#each distributionHistory as distribution, index}
                <div class="flex justify-items-center items-center overflow-x-auto">
                    <button class="btn btn-secondary no-animation btn-circle mr-3 hover:bg-secondary cursor-default">
                        {index + 1}
                    </button>
                    <div class="flex-1">
                        <DistributionDisplay distribution={distribution}/>
                    </div>

                </div>
            {/each}

            {#if distributionHistory.length > 0}
                <div class="mt-6 mb-10">
                    <div class="flex flex-col md:flex-row justify-center ">
                        <div class="flex justify-center m-2" on:click={exportAsCSV}>
                            <div class="btn btn-primary btn-wide">Export as a CSV file</div>
                        </div>
                        <div class="flex justify-center m-2" on:click={exportasJSON}>
                            <div class="btn btn-primary btn-wide">Export as a JSON file</div>
                        </div>
                    </div>
                </div>
            {/if}

            <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box" class:collapse-open={show_additional_info}>
                <div class="collapse-title text-xl font-medium cursor-pointer" on:click={()=>{show_additional_info = !show_additional_info}}>
                    Click to get more information about how this works.
                </div>
                <div class="collapse-content text-left overflow-hidden">
                    <div class="p-6">
                        <p>This application allows you to generate random distributions to assign m values to n possible choices. Assuming you know the seed and do the same actions, every sequence of distributions is reproducible.
                        </p>
                        <p>
                            You can export the generated distributions as a CSV file or as a JSON file.
                        </p>
                        <p>
                            As source of randomness the PCG-Family - specifically the 32-bit variant - is used. The specific library used on this website can be found <a class="link link-accent" href="https://github.com/alisey/pcg32">here</a>.
                        </p>
                        <div>
                            There are two algorithms available which are used to generate the assignments.
                            <br/>
                            <br>
                            <b>Algorithm 1</b> works the following way:
                            <br><br>
                            <ol class="list-decimal">
                                <li>
                                    As long as not m assignments were made.
                                </li>
                                <li>
                                    Pick a random integer number in the range of 0-(n-1) (unbiased).
                                </li>
                                <li>
                                    Check if this number was picked before. If it was picked before do nothing and return to 2.
                                </li>
                                <li>
                                    Now check if we are preventing groups. If we are preventing groups, get the relative base number for our current group of n <code class="bg-base-200">(random_number - random_number % multiples_of_n)</code>. Check if relative to this number in the group of n number, a pick already was made. If there is one in this range, "discard" the value again and return to step 2. again.
                                </li>
                                <li>
                                    The current random number passsed all checks, so we can use it. Add it to the used random numbers (assign the possible value the index of the current iteration). And increase the amount of assigned numbers.
                                </li>
                                <br><br>
                                <b>Algorithm 2</b> on the other hand does not always randomly draw a new number in the entire range, but keeps a list of all possible choices and draws from them.
                                <br><br>
                                <ol class="list-decimal">
                                    <li>
                                        Generate a list of all possible choices (0-(n-1)).
                                    </li>
                                    <li>
                                        As long as not m assignments were made.
                                    </li>
                                    <li>
                                        Pick a random integer number in the range of 0-(possible choices left - 1).
                                    </li>
                                    <li>
                                        Now check if we are preventing groups. If we are preventing groups, get the relative base number for our current group of n <code class="bg-base-200">possible_picks[random_index] - possible_picks[random_index] % multiples_of_n</code>. Check if relative to this number in the group of n number, a pick already was made. If there is one in this range, "discard" the value again and return to step 2. again.
                                    </li>
                                    <li>
                                        The current random number passed all checks, so we can use it. Add it to the used random numbers (assign the possible value the index of the current iteration). Next remove it from the pool of possible choices. As last step increase the amount of assigned numbers.
                                    </li>
                            </ol>

                            <br/><br/>

                            The algorithms roughly look like this in this application:

                            <div class="flex flex-col 2xl:flex-row justify-center overflow-hidden">
                                <div class="m-4 overflow-x-auto flex-1">
                                    <svelte:component this={Prism} showLineNumbers="{true}" >
                                        {Algorithm1Example}
                                    </svelte:component>
                                </div>
                                <div class="m-4 overflow-x-auto flex-1">
                                    <svelte:component this={Prism} showLineNumbers="{true}">
                                        {Algorithm2Example}
                                    </svelte:component>
                                </div>


                            </div>


                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

</div>
<svelte:window on:keydown={handleKeydown}/>

<script lang="ts">

  import {getState, randomInt, seed} from '@alisey/pcg32'
  import type {DistributionConfig} from "../types/main";
  import DistributionDisplay from "../components/DistributionDisplay.svelte";
  import {onMount} from "svelte";

  import {Algorithm1Example, Algorithm2Example} from "../Misc";

  import "prismjs/plugins/line-numbers/prism-line-numbers.css";
  import "prismjs/themes/prism-tomorrow.css";

  export const prerender = true;
  export const hydrate = true;

  let Prism;

  let show_debug_info = false;
  let show_additional_info = false;
  let use_array_based_algorithm = true;

  let seed_value: BigInt
  let seed_text: string

  let choices = 30;
  let assignments = 5;

  let multiples_of_n = 3;

  let prevent_grouped_assignments = false;

  $: inefficient = choices >= 5000 && assignments >= 4000;

  let distributionHistory: DistributionConfig[] = [];

  // On change function resetting the values into correct ranges
  let handleChange = () => {
    if (choices < 1) {
      choices = 1;
    }
    if (assignments > choices) {
      assignments = choices;
    }
    if (assignments < 1) {
      assignments = 1;
    }

    if (multiples_of_n >= choices / assignments) {
      multiples_of_n = Math.floor(choices / assignments);
    }

    if (multiples_of_n <= 1) {
      prevent_grouped_assignments = false;
    }
  }

  let onPressGenerate = () => {
    const distribution = generateDistribution();
    // Use spread instead of push to have reactivity in svelte
    distributionHistory = [...distributionHistory, distribution];
    console.log(distribution.distribution)
    console.log(distributionHistory)
  }

  let benchmark = () => {
    const start1 = performance.now();

    for (let i = 0; i < 100; i++) {
      const distribution = generateDistribution(true);
    }

    const duration1 = performance.now() - start1;
    console.log(duration1)

    const start2 = performance.now();
    for (let i = 0; i < 100; i++) {
      const distribution = generateDistribution(false);
    }
    const duration2 = performance.now() - start2;
    console.log(duration2)

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

  // Generate random distribution of assignments
  let generateDistribution = (use_array_algorithm = use_array_based_algorithm) => {

    const currentDistribution: DistributionConfig = {
      choices,
      assignments,
      seed: seed_value,
      internal_state: getState(),
      use_array_based_algorithm: use_array_algorithm,
      multiples_of_n: multiples_of_n,
      prevent_grouped_assignments,
      distribution: new Map(),
    };

    let assigned = 0;
    // Generate list with possible picks which goes from 1 to choices
    const possible_picks = [];
    for (let i = 0; i < choices; i++) {
      possible_picks.push(i);
    }

    outer_loop:
      while (assigned < assignments) {

        // This algorithm generates a list with all possible picks, and then picks from this list and removes the entry
        // The advantage of this approach is, that you can't get the same number multiple times in a row
        if (use_array_algorithm) {
          // Now randomly choose and remove a pick from the list
          let random_index = randomInt(possible_picks.length);


          // Check if we have additional rules we have to watch out for
          if (prevent_grouped_assignments && multiples_of_n > 1) {
            // Get the base for multiples of n for the current random number
            let base = possible_picks[random_index] - possible_picks[random_index] % multiples_of_n;

            // If any of the base numbers already exist, skip this random number and try again
            for (let i = 0; i < multiples_of_n; i++) {
              if (currentDistribution.distribution.has(base + i)) {
                continue outer_loop;
              }
            }
          }

          // If the pick is valid, add it to the distribution
          currentDistribution.distribution.set(possible_picks[random_index], assigned + 1);
          // Remove it from the temporary array with all possible entries
          // Because splice is very slow, we rearrange the last element to the current position and just remove the last element
          possible_picks[random_index] = possible_picks[possible_picks.length - 1];
          possible_picks.pop();
          assigned++;

        }
        // This algorithm just brute forces it, it gets any random number, and if was already used, it tries again until it gets a number which wasn't used before
        else {
          let random_number = randomInt(choices);
          if (!currentDistribution.distribution.has(random_number)) {

            if (prevent_grouped_assignments && multiples_of_n > 1) {
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
      }

    return currentDistribution;
  }

  let exportAsCSV = () => {
    let csv = "";
    for (let i = 0; i < distributionHistory.length; i++) {
      let distribution = distributionHistory[i];
      let header = "";
      let row = "";
      for (let i = 1; i < distribution.choices + 1; i++) {
        header += `"${i}",`;
        row += `"${distribution.distribution.get(i) || ''}",`;
      }
      header += ",seed,choices,assignments,use_array_based_algorithm,multiples_of_n,prevent_grouped_assignments, state\n";
      row += `,"${distribution.seed}","${distribution.choices}","${distribution.assignments}","${distribution.use_array_based_algorithm}","${distribution.multiples_of_n}","${distribution.prevent_grouped_assignments}","${distribution.internal_state}"\n`;
      csv += header + row;
    }

    downloadFile(csv, "Exported Distributions.csv", "text/csv;charset=utf-8;");
  }

  let exportasJSON = () => {
    let json = JSON.stringify(distributionHistory, (key, value) =>
      typeof value === 'bigint'
        ? value.toString()
        : value instanceof Map
          ? Array.from(value.entries())
          : value
    );
    downloadFile(json, "Exported Distributions.json", "application/json;");
  }

  function downloadFile(content: string, filename: string, type: string) {
    let blob = new Blob([content], {type});

    // Download link
    let downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  function handleKeydown(event) {
    if (event.key == "d") {
      show_debug_info = !show_debug_info;
    }
  }

  onMount(async () => {
    generateNewRandomSeed();


    // Load the prismjs first after the page is loaded
    const prismModule = await import("svelte-prismjs");
    await import("prismjs/components/prism-c.js");
    await import("prism-svelte");

    await import("prismjs/plugins/line-highlight/prism-line-highlight.js");
    // Once everything is loaded load the prismjs module
    Prism = prismModule.default;


  })

</script>

<style>
    .remove-wheel::-webkit-inner-spin-button,
    .remove-wheel::-webkit-outer-spin-button,
    .remove-wheel {
        -webkit-appearance: none;
        -moz-appearance: textfield;
        margin: 0;
    }

</style>
