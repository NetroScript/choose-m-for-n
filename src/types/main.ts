export type DistributionConfig = {
  runners: number,
  negatives: number,
  seed: bigint,
  internal_state: bigint,
  prevent_grouped_negatives: boolean,
  multiples_of_n: number,
  distribution: Map<number, number>
}
