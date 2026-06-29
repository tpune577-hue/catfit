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

export const EXERCISE_CDN =
  "https://cdn.jsdelivr.net/gh/hasaneyldrm/exercises-dataset@main";
