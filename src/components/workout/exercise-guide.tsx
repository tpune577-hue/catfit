import type { Exercise } from "@/types/exercise";
import { getExerciseGuide } from "@/lib/exercise-i18n";
import { Target, Dumbbell } from "lucide-react";

export function ExerciseGuide({ exercise }: { exercise: Exercise }) {
  const guide = getExerciseGuide(exercise);

  return (
    <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
          โฟกัส: {guide.focusArea}
        </span>
        <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
          {guide.targetLabel}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1 text-sm text-primary">
          <Dumbbell className="h-3.5 w-3.5" />
          {guide.equipmentLabel}
        </span>
      </div>

      <div className="rounded-xl border-2 border-primary/50 bg-secondary px-4 py-3">
        <div className="flex gap-2">
          <Target className="mt-0.5 h-4 w-4 shrink-0 text-foreground" aria-hidden />
          <div>
            <p className="text-sm font-bold text-foreground">วิธีโฟกัส</p>
            <p className="mt-1 text-base leading-relaxed">{guide.focusTip}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-bold">ขั้นตอนการทำ</p>
        <ol className="space-y-2">
          {guide.steps.map((step) => (
            <li
              key={step}
              className="text-base leading-relaxed text-foreground/90"
            >
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
