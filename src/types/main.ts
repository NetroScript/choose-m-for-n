export type DistributionConfig = {
  runners: number,
  negatives: number,
  seed: bigint,
  internal_state: bigint,
  use_array_based_algorithm: boolean,
  prevent_grouped_negatives: boolean,
  multiples_of_n: number,
  distribution: Map<number, number>
}
