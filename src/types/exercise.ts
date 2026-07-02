export interface RawExercise {
  id: string;
  name: string;
  category: string;
  body_part: string;
  equipment: string;
  instructions: { en?: string; tr?: string };
  instruction_steps?: { en?: string[] };
  muscle_group?: string;
  secondary_muscles?: string[];
  target: string;
  image: string;
  gif_url: string;
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

// The hasaneyldrm/exercises-dataset repo stopped bundling images/videos
// (media ownership dispute); media_id (e.g. "2gPfomN" from "0001-2gPfomN.gif")
// still resolves on ExerciseDB's own CDN.
export const EXERCISE_CDN = "https://static.exercisedb.dev/media";
