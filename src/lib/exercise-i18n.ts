import type { Exercise, RawExercise } from "@/types/exercise";
import { getThaiInstructionSteps } from "@/lib/exercise-steps-th";
import {
  translateMuscle,
  translateCategory,
  translateEquipment,
} from "@/lib/exercise-labels";

export { translateMuscle, translateCategory, translateEquipment };

const TARGET_FOCUS: Record<string, { area: string; tip: string }> = {
  abs: {
    area: "หน้าท้อง",
    tip: "เกร็งกล้ามท้องตลอดท่า หายใจออกตอนออกแรง อย่าดึงคอ",
  },
  biceps: {
    area: "หน้าแขน",
    tip: "ข้อศอกอยู่กับที่ ยกน้ำหนักด้วยแรงจากไบเซ็ป ไม่แกว่งตัว",
  },
  triceps: {
    area: "หลังแขน",
    tip: "ข้อศอกชี้ลงหรืออยู่กับลำตัว ยืด-หดที่ข้อศอกเป็นหลัก",
  },
  pectorals: {
    area: "กล้ามอก",
    tip: "บีบอกเข้าหากัน รู้สึกยืดที่อกตอนลง ไหล่ไม่ยกสูงเกิน",
  },
  "pectoralis major": {
    area: "กล้ามอก",
    tip: "บีบอกเข้าหากัน รู้สึกยืดที่อกตอนลง",
  },
  lats: {
    area: "หลังด้านข้าง",
    tip: "ดึงด้วยข้อศอก ไม่ใช่มือ บีบสะบักเข้าหากัน",
  },
  deltoids: {
    area: "ไหล่",
    tip: "ยกด้วยไหล่ ไม่ใช้แรงโยน คอผ่อนคลาย",
  },
  glutes: {
    area: "ก้น",
    tip: "บีบก้นตอนขึ้น น้ำหนักอยู่ที่ส้นเท้าและกลางเท้า",
  },
  quadriceps: {
    area: "ต้นขาหน้า",
    tip: "เข่าชี้ทิศเดียวกับเท้า ลงลึกจนรู้สึกต้นขาทำงาน",
  },
  hamstrings: {
    area: "ต้นขาหลัง",
    tip: "งอสะโพก รู้สึกยืดที่ต้นขาหลัง หลังตรง",
  },
  calves: {
    area: "น่อง",
    tip: "ยกส้นเท้าสูงสุด หยุดค้างด้านบน 1 วินาที",
  },
  "lower back": {
    area: "หลังล่าง",
    tip: "เกร็งแกนกลาง หลังตรง ไม่โค้งหลังมากเกิน",
  },
};

export interface ExerciseGuide {
  nameTh: string;
  targetLabel: string;
  categoryLabel: string;
  equipmentLabel: string;
  focusArea: string;
  focusTip: string;
  steps: string[];
}

export function getExerciseGuide(exercise: Exercise): ExerciseGuide {
  const targetKey = exercise.target.toLowerCase();
  const focus = TARGET_FOCUS[targetKey] ?? {
    area: translateMuscle(exercise.target),
    tip: `รู้สึกว่า${translateMuscle(exercise.target)}ทำงานตลอดท่า ทำช้า ๆ คุมท่าให้นิ่ง`,
  };

  const rawSteps = getThaiInstructionSteps(exercise);

  const steps = rawSteps.map((step, i) => {
    const text = step.trim();
    return `${i + 1}. ${text}`;
  });

  return {
    nameTh: exercise.name,
    targetLabel: translateMuscle(exercise.target),
    categoryLabel: translateCategory(exercise.category),
    equipmentLabel: translateEquipment(exercise.equipment),
    focusArea: focus.area,
    focusTip: focus.tip,
    steps: steps.length > 0 ? steps : [`1. ทำท่า${exercise.name} ช้า ๆ โฟกัสที่${focus.area}`],
  };
}

export function normalizeExerciseWithSteps(raw: RawExercise) {
  const instructionSteps =
    raw.instruction_steps?.en ??
    (raw.instructions?.en
      ? raw.instructions.en.split(/(?<=[.!])\s+/).filter((s) => s.length > 10)
      : []);

  return instructionSteps;
}
