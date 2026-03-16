import { astar } from "./astar";
import { dijkstra } from "./dijkstra";
import { bfs } from "./bfs";
import type { AlgorithmFn, AlgorithmId } from "./types";

export const ALGORITHMS: Record<AlgorithmId, AlgorithmFn> = {
  astar,
  dijkstra,
  bfs,
};

export const ALGO_NAMES: Record<AlgorithmId, string> = {
  astar: "A* Search",
  dijkstra: "Dijkstra",
  bfs: "BFS",
};

export const ALGO_DESCRIPTIONS: Record<AlgorithmId, string> = {
  astar: "Optimal pathfinding guided by Manhattan/Octile heuristic",
  dijkstra: "Guaranteed shortest path without heuristic guidance",
  bfs: "Unweighted shortest path — simple baseline comparison",
};

export type { AlgorithmId, AlgorithmFn, AlgoStep, AlgoGenerator } from "./types";
