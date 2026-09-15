export interface WorkoutResultLog {
  id: string;
  createdAt: string;
  /** Compressed JPEG data URL of the uploaded result photo (e.g. a smartwatch summary card). */
  imageDataUrl: string;
  activityName?: string;
  calories?: number;
  durationSeconds?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  steps?: number;
  note?: string;
}
