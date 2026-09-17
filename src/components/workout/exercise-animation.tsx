import { ExerciseImage } from "@/components/workout/exercise-image";

/**
 * Loops an exercise's two stills (start and end of the movement) like a gif.
 * The swap is a CSS animation rather than a JS timer so the app's global
 * prefers-reduced-motion rule stops it — a timer would keep flipping.
 */
export function ExerciseAnimation({
  frames,
  alt,
}: {
  frames: string[];
  alt: string;
}) {
  const [first, second] = [...new Set(frames.filter(Boolean))];

  if (!first) return null;
  if (!second) return <ExerciseImage src={first} alt={alt} />;

  return (
    <>
      <ExerciseImage src={second} alt={alt} />
      <div className="absolute inset-0 animate-exercise-frame">
        <ExerciseImage src={first} alt="" />
      </div>
    </>
  );
}
