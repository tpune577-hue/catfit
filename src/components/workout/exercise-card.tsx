import type { Exercise } from "@/types/exercise";
import { ExerciseImage } from "@/components/workout/exercise-image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  translateMuscle,
  translateCategory,
  translateEquipment,
  getExerciseGuide,
} from "@/lib/exercise-i18n";

export function ExerciseCard({
  exercise,
  onClick,
}: {
  exercise: Exercise;
  onClick?: () => void;
}) {
  const guide = getExerciseGuide(exercise);

  return (
    <Card
      className={onClick ? "cursor-pointer transition-shadow hover:shadow-md" : ""}
      onClick={onClick}
    >
      <CardContent className="flex gap-3 p-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
          <ExerciseImage src={exercise.imageUrl} alt={exercise.name} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-sm">{exercise.name}</p>
          <p className="text-xs text-muted-foreground">
            โฟกัส {guide.focusArea} · {translateEquipment(exercise.equipment)}
          </p>
          <Badge variant="secondary" className="mt-1 text-[10px]">
            {translateCategory(exercise.category)} · {translateMuscle(exercise.target)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
