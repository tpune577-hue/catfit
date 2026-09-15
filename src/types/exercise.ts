export interface RawExercise {
  id: string;
  name: string;
  force: string | null;
  level: string;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  target: string;
  equipment: string;
  secondaryMuscles: string[];
  instructions: string;
  instructionSteps: string[];
  instructionStepsTh: string[];
  imageUrl: string;
  gifUrl: string;
}

// free-exercise-db (yuhonas/free-exercise-db) commits exercise photos directly
// into the repo, so jsDelivr's GitHub-file CDN mirrors them reliably — unlike
// the old hasaneyldrm/exercises-dataset, which depended on a third-party media
// host that stopped serving files.
export const EXERCISE_CDN =
  "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises";
