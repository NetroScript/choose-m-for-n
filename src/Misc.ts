export const Algorithm1Example =
`// Algorithm 1:
let distribution = new Map();
let assigned = 0;

// Choices is the total number of choices, set in the app
// Assignments is the total number of assignments done to the choices, set in the app
// multiples_of_n is the group size which is used, where in one group only 1 pick is allowed
// prevent_grouped_assignments is a boolean which determines if multiples_of_n is used

outer_loop:
  while (assigned < assignments) {
    /**
     * Returns a uniformly distributed 32-bit unsigned random integer in the range
     * [0, bound).
     */
    let random_number = randomInt(choices);
    if (!distribution.has(random_number)) {

      if (prevent_grouped_assignments && multiples_of_n > 1) {
        // Get the base for multiples of n for the current random number
        let base = random_number - random_number % multiples_of_n;

        // If any of the base numbers already exist, skip this random number and try again
        for (let i = 0; i < multiples_of_n; i++) {
          if (distribution.has(base + i)) {
            continue outer_loop;
          }
        }
      }
      distribution.set(random_number, assigned + 1);
      assigned++;
    }
  }
`
export const Algorithm2Example =
`// Algorithm 2:
let distribution = new Map();
let assigned = 0;

const possible_picks = [];
for (let i = 0; i < choices; i++) {
  possible_picks.push(i);
}

outer_loop:
  while (assigned < assignments) {
    // Randomly choose and index which will later be removed from the list
    let random_index = randomInt(possible_picks.length);

    // Check if we have additional rules we have to watch out for
    if (prevent_grouped_assignments && multiples_of_n > 1) {
      // Get the base for multiples of n for the current random number
      let base = possible_picks[random_index] - possible_picks[random_index] % multiples_of_n;

      // If any of the base numbers already exist, skip this random number and try again
      for (let i = 0; i < multiples_of_n; i++) {
        if (distribution.has(base + i)) {
          continue outer_loop;
        }
      }
    }

    // If the pick is valid, add it to the distribution
    distribution.set(possible_picks[random_index], assigned + 1);
    // Remove it from the temporary array with all possible entries
    // Because splice is very slow, we rearrange the last element to the current position and just remove the last element
    possible_picks[random_index] = possible_picks[possible_picks.length - 1];
    possible_picks.pop();
    assigned++;
  }
`
