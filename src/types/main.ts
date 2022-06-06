export type DistributionConfig = {
  choices: number,
  assignments: number,
  seed: bigint,
  internal_state: bigint,
  use_array_based_algorithm: boolean,
  prevent_grouped_assignments: boolean,
  multiples_of_n: number,
  distribution: Map<number, number>
}
