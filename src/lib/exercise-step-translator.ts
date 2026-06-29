/**
 * Offline Thai step translator for exercise instructions.
 * Used as fallback when pre-translated steps are unavailable.
 */

const EXACT: Record<string, string> = {
  "Repeat for the desired number of repetitions.":
    "ทำซ้ำตามจำนวนครั้งที่กำหนด",
  "Repeat for the desired number of repetitions":
    "ทำซ้ำตามจำนวนครั้งที่กำหนด",
  "Continue alternating sides for the desired number of repetitions.":
    "สลับทำสองด้านซ้ำตามจำนวนครั้งที่กำหนด",
  "Repeat for the desired number of repetitions, then switch arms.":
    "ทำซ้ำตามจำนวนครั้งที่กำหนด แล้วสลับแขน",
  "Repeat for the desired number of repetitions, then switch sides.":
    "ทำซ้ำตามจำนวนครั้งที่กำหนด แล้วสลับด้าน",
  "Repeat for the desired number of repetitions, then switch to the other arm.":
    "ทำซ้ำตามจำนวนครั้งที่กำหนด แล้วสลับไปอีกแขน",
  "Repeat for the desired number of repetitions, then switch legs.":
    "ทำซ้ำตามจำนวนครั้งที่กำหนด แล้วสลับขา",
  "Repeat on the other side.":
    "ทำซ้ำอีกด้านหนึ่ง",
  "Continue alternating arms for the desired number of repetitions.":
    "สลับแขนซ้ำตามจำนวนครั้งที่กำหนด",
  "Lie flat on your back with your knees bent and feet flat on the ground.":
    "นอนหงาย งอเข่า เท้าแบนราบพื้น",
  "Place your hands behind your head with your elbows pointing outwards.":
    "วางมือไว้หลังศีรษะ ให้ข้อศอกชี้ออกด้านข้าง",
  "Stand with your feet shoulder-width apart.":
    "ยืนแยกเท้ากว้างเท่าไหล่",
  "Stand with your feet shoulder-width apart and your knees slightly bent.":
    "ยืนแยกเท้ากว้างเท่าไหล่ งอเข่าเล็กน้อย",
  "Keep your back straight and your core engaged.":
    "รักษาหลังให้ตรงและเกร็งแกนกลางลำตัว",
  "Set up an incline bench at a 45-degree angle.":
    "ปรับเบนช์เอียงที่มุม 45 องศา",
};

/** Longest-first phrase replacements */
const PHRASES: [RegExp, string][] = [
  [/repeat for the desired number of repetitions, then switch to the other arm/gi, "ทำซ้ำตามจำนวนครั้งที่กำหนด แล้วสลับไปอีกแขน"],
  [/repeat for the desired number of repetitions, then switch arms/gi, "ทำซ้ำตามจำนวนครั้งที่กำหนด แล้วสลับแขน"],
  [/repeat for the desired number of repetitions, then switch sides/gi, "ทำซ้ำตามจำนวนครั้งที่กำหนด แล้วสลับด้าน"],
  [/repeat for the desired number of repetitions, then switch legs/gi, "ทำซ้ำตามจำนวนครั้งที่กำหนด แล้วสลับขา"],
  [/continue alternating sides for the desired number of repetitions/gi, "สลับทำสองด้านซ้ำตามจำนวนครั้งที่กำหนด"],
  [/continue alternating arms for the desired number of repetitions/gi, "สลับแขนซ้ำตามจำนวนครั้งที่กำหนด"],
  [/continue alternating legs for the desired number of repetitions/gi, "สลับขาซ้ำตามจำนวนครั้งที่กำหนด"],
  [/repeat for the desired number of repetitions/gi, "ทำซ้ำตามจำนวนครั้งที่กำหนด"],
  [/repeat on the other side/gi, "ทำซ้ำอีกด้านหนึ่ง"],
  [/return to the starting position/gi, "กลับสู่ท่าเริ่มต้น"],
  [/starting position/gi, "ท่าเริ่มต้น"],
  [/lie flat on your back with your knees bent and feet flat on the (?:ground|floor)/gi, "นอนหงาย งอเข่า เท้าแบนราบพื้น"],
  [/lie flat on a bench with your head at one end and your feet on the floor/gi, "นอนบนเบนช์ ศีรษะอยู่ปลายเบนช์ เท้าวางพื้น"],
  [/lie flat on a bench/gi, "นอนบนเบนช์"],
  [/lie on your back/gi, "นอนหงาย"],
  [/sit on a bench with your back straight and feet flat on the ground/gi, "นั่งบนเบนช์ หลังตรง เท้าแบนราบพื้น"],
  [/sit on a bench/gi, "นั่งบนเบนช์"],
  [/stand with your feet shoulder-width apart and your knees slightly bent/gi, "ยืนแยกเท้ากว้างเท่าไหล่ งอเข่าเล็กน้อย"],
  [/stand with your feet shoulder-width apart/gi, "ยืนแยกเท้ากว้างเท่าไหล่"],
  [/stand facing the machine with your feet shoulder-width apart/gi, "ยืนหันหน้าเข้าหาเครื่อง แยกเท้ากว้างเท่าไหล่"],
  [/stand facing away from the machine with your feet shoulder-width apart/gi, "ยืนหันหลังให้เครื่อง แยกเท้ากว้างเท่าไหล่"],
  [/place your hands behind your head with your elbows pointing outwards/gi, "วางมือไว้หลังศีรษะ ให้ข้อศอกชี้ออกด้านข้าง"],
  [/place your hands on the sides of the bench for support/gi, "วางมือข้างเบนช์เพื่อพยุงตัว"],
  [/place your hands directly under your shoulders/gi, "วางมือใต้ไหล่ตรง ๆ"],
  [/assume a push-up position with your hands directly under your shoulders and your body in a straight line from head to heels/gi, "ทำท่าวิดพื้น มืออยู่ใต้ไหล่ ลำตัวเป็นเส้นตรงจากศีรษะถึงส้นเท้า"],
  [/engaging your abs, slowly lift your upper body off the ground, curling forward until your torso is at a 45-degree angle/gi, "เกร็งกล้ามท้อง ค่อย ๆ ยกลำตัวขึ้นจากพื้น งอตัวไปข้างหน้าจนลำตัวทำมุม 45 องศา"],
  [/pause for a moment at the top, then slowly lower your upper body back down to the starting position/gi, "หยุดค้างด้านบนสักครู่ แล้วค่อย ๆ ลดลำตัวกลับสู่ท่าเริ่มต้น"],
  [/pause for a moment at the top, then slowly lower your (?:body|arms|legs|heels|dumbbells?) back (?:down )?to the starting position/gi, "หยุดค้างด้านบนสักครู่ แล้วค่อย ๆ ลดกลับสู่ท่าเริ่มต้น"],
  [/pause for a moment at the bottom, then push through your heels to return to the starting position/gi, "หยุดค้างด้านล่างสักครู่ แล้วดันผ่านส้นเท้ากลับสู่ท่าเริ่มต้น"],
  [/pause for a moment at the top, squeezing your biceps/gi, "หยุดค้างด้านบน บีบไบเซ็ป"],
  [/hold the contracted position for a brief pause as you squeeze your biceps/gi, "ค้างท่าที่หดตัวสักครู่ พร้อมบีบไบเซ็ป"],
  [/keeping your upper arms stationary, exhale and curl the weights while contracting your biceps/gi, "ให้ต้นแขนบนอยู่กับที่ หายใจออกแล้วงอน้ำหนัก พร้อมบีบไบเซ็ป"],
  [/keeping your back straight and your core engaged/gi, "รักษาหลังให้ตรงและเกร็งแกนกลางลำตัว"],
  [/keep your back straight and your core engaged/gi, "รักษาหลังให้ตรงและเกร็งแกนกลางลำตัว"],
  [/bend your knees slightly and hinge forward at the hips, keeping your back straight/gi, "งอเข่าเล็กน้อย โน้มตัวที่สะโพก รักษาหลังให้ตรง"],
  [/inhale and slowly begin to lower the dumbbells back to the starting position/gi, "หายใจเข้า แล้วค่อย ๆ ลดดัมเบลกลับสู่ท่าเริ่มต้น"],
  [/exhale and push/gi, "หายใจออกแล้วดัน"],
  [/exhale and pull/gi, "หายใจออกแล้วดึง"],
  [/inhale and lower/gi, "หายใจเข้าแล้วลด"],
  [/exhale and lift/gi, "หายใจออกแล้วยก"],
  [/breathe in/gi, "หายใจเข้า"],
  [/breathe out/gi, "หายใจออก"],
  [/inhale/gi, "หายใจเข้า"],
  [/exhale/gi, "หายใจออก"],
  [/adjust the cable machine to a low pulley position/gi, "ปรับเครื่องเคเบิลให้ลูกรอกอยู่ต่ำ"],
  [/adjust the cable machine to a high pulley position/gi, "ปรับเครื่องเคเบิลให้ลูกรอกอยู่สูง"],
  [/attach a straight bar to the cable/gi, "ติดบาร์ตรงกับสายเคเบิล"],
  [/grasp the bar with an overhand grip/gi, "จับบาร์แบบมือจับด้านบน"],
  [/grasp the bar with an underhand grip/gi, "จับบาร์แบบมือจับด้านล่าง"],
  [/push through your palms/gi, "ดันผ่านฝ่ามือ"],
  [/push through your heels/gi, "ดันผ่านส้นเท้า"],
  [/slowly lower/gi, "ค่อย ๆ ลด"],
  [/slowly lift/gi, "ค่อย ๆ ยก"],
  [/slowly raise/gi, "ค่อย ๆ ยก"],
  [/slowly bend/gi, "ค่อย ๆ งอ"],
  [/slowly extend/gi, "ค่อย ๆ เหยียด"],
  [/slowly return/gi, "ค่อย ๆ กลับ"],
  [/shoulder-width apart/gi, "กว้างเท่าไหล่"],
  [/hip-width apart/gi, "กว้างเท่าสะโพก"],
  [/core engaged/gi, "เกร็งแกนกลางลำตัว"],
  [/back straight/gi, "หลังตรง"],
  [/upper body/gi, "ลำตัวส่วนบน"],
  [/lower body/gi, "ลำตัวส่วนล่าง"],
  [/upper arms/gi, "ต้นแขนบน"],
  [/lower the/gi, "ลด"],
  [/raise the/gi, "ยก"],
  [/lift the/gi, "ยก"],
  [/bend your elbows/gi, "งอข้อศอก"],
  [/extend your arms/gi, "เหยียดแขน"],
  [/dumbbells/gi, "ดัมเบล"],
  [/dumbbell/gi, "ดัมเบล"],
  [/barbell/gi, "บาร์เบล"],
  [/kettlebell/gi, "เคตเทิลเบล"],
  [/cable machine/gi, "เครื่องเคเบิล"],
  [/resistance band/gi, "ยางยืด"],
  [/\bband\b/gi, "ยางยืด"],
  [/bench/gi, "เบนช์"],
  [/chest/gi, "อก"],
  [/shoulders/gi, "ไหล่"],
  [/knees/gi, "เข่า"],
  [/elbows/gi, "ข้อศอก"],
  [/hips/gi, "สะโพก"],
  [/torso/gi, "ลำตัว"],
  [/ground/gi, "พื้น"],
  [/floor/gi, "พื้น"],
];

const WORDS: [RegExp, string][] = [
  [/\band then\b/gi, "แล้ว"],
  [/\bthen\b/gi, "แล้ว"],
  [/\bwhile\b/gi, "ขณะที่"],
  [/\bwith\b/gi, "โดย"],
  [/\byour\b/gi, ""],
  [/\bthe\b/gi, ""],
  [/\ba\b/gi, ""],
  [/\ban\b/gi, ""],
  [/\bto\b/gi, "ไปยัง"],
  [/\bof\b/gi, ""],
  [/\bon\b/gi, "บน"],
  [/\bat\b/gi, "ที่"],
  [/\bfor\b/gi, ""],
  [/\bkeeping\b/gi, "โดยรักษา"],
  [/\bmaintain\b/gi, "รักษา"],
  [/\bhold\b/gi, "ถือ"],
  [/\bplace\b/gi, "วาง"],
  [/\bstand\b/gi, "ยืน"],
  [/\bsit\b/gi, "นั่ง"],
  [/\blie\b/gi, "นอน"],
  [/\bbend\b/gi, "งอ"],
  [/\blift\b/gi, "ยก"],
  [/\blower\b/gi, "ลด"],
  [/\braise\b/gi, "ยก"],
  [/\bpush\b/gi, "ดัน"],
  [/\bpull\b/gi, "ดึง"],
  [/\bsqueeze\b/gi, "บีบ"],
  [/\bcontracting\b/gi, "หด"],
  [/\bcontract\b/gi, "หด"],
  [/\bengaging\b/gi, "เกร็ง"],
  [/\bengage\b/gi, "เกร็ง"],
  [/\bparallel\b/gi, "ขนาน"],
  [/\bstraight\b/gi, "ตรง"],
  [/\bslightly\b/gi, "เล็กน้อย"],
  [/\bslowly\b/gi, "ค่อย ๆ"],
  [/\bpause\b/gi, "หยุดค้าง"],
  [/\bmoment\b/gi, "สักครู่"],
  [/\brepeat\b/gi, "ทำซ้ำ"],
  [/\bcontinue\b/gi, "ทำต่อ"],
  [/\balternating\b/gi, "สลับ"],
  [/\bsides\b/gi, "ด้าน"],
  [/\barms\b/gi, "แขน"],
  [/\blegs\b/gi, "ขา"],
  [/\bfeet\b/gi, "เท้า"],
  [/\bhands\b/gi, "มือ"],
  [/\bhead\b/gi, "ศีรษะ"],
  [/\bback\b/gi, "หลัง"],
  [/\babs\b/gi, "กล้ามท้อง"],
  [/\bbiceps\b/gi, "ไบเซ็ป"],
  [/\btriceps\b/gi, "ไตรเซ็ป"],
  [/\bglutes\b/gi, "ก้น"],
  [/\bquadriceps\b/gi, "ต้นขาหน้า"],
  [/\bhamstrings\b/gi, "ต้นขาหลัง"],
  [/\bcalves\b/gi, "น่อง"],
];

const ALLOWED_ENGLISH = new Set(["ez"]);

export function isMostlyEnglish(text: string): boolean {
  const englishWords =
    text.match(/\b[a-zA-Z]{2,}\b/g)?.filter(
      (w) => !ALLOWED_ENGLISH.has(w.toLowerCase())
    ) ?? [];
  return englishWords.length > 0;
}

export function translateStepOffline(en: string, cache?: Record<string, string>): string {
  const key = en.trim();
  if (cache?.[key]) return cache[key];
  if (EXACT[key]) return EXACT[key];

  let result = key.replace(/\s+/g, " ");
  for (const [pattern, replacement] of PHRASES) {
    result = result.replace(pattern, replacement);
  }

  if (!isMostlyEnglish(result)) {
    return cleanup(result);
  }

  for (const [pattern, replacement] of WORDS) {
    result = result.replace(pattern, replacement);
  }

  return cleanup(result);
}

function cleanup(text: string): string {
  return text
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.])/g, "$1")
    .replace(/^\s+|\s+$/g, "")
    .replace(/\s+,\s+/g, " ");
}

import type { Exercise } from "@/types/exercise";
import {
  translateMuscle,
  translateEquipment,
  MUSCLE_TH,
  EQUIPMENT_TH,
} from "@/lib/exercise-labels";

type Movement =
  | "pushup"
  | "squat"
  | "curl"
  | "press"
  | "row"
  | "pullup"
  | "plank"
  | "crunch"
  | "lunge"
  | "raise"
  | "extension"
  | "generic";

function detectMovement(name: string, category: string): Movement {
  const n = name.toLowerCase();
  if (n.includes("push-up") || n.includes("push up")) return "pushup";
  if (n.includes("pull-up") || n.includes("pull up") || n.includes("chin-up"))
    return "pullup";
  if (n.includes("squat")) return "squat";
  if (n.includes("lunge")) return "lunge";
  if (n.includes("plank")) return "plank";
  if (n.includes("crunch") || n.includes("sit-up") || n.includes("sit up"))
    return "crunch";
  if (n.includes("curl")) return "curl";
  if (n.includes("row")) return "row";
  if (n.includes("press")) return "press";
  if (n.includes("extension")) return "extension";
  if (n.includes("raise")) return "raise";
  if (category === "waist") return "crunch";
  if (category === "cardio") return "generic";
  return "generic";
}

const MOVEMENT_STEPS: Record<Movement, (ex: Exercise) => string[]> = {
  pushup: (ex) => [
    `วางมือกว้างกว่าไหล่เล็กน้อย ลำตัวเป็นเส้นตรงจากศีรษะถึงส้นเท้า (ใช้${translateEquipment(ex.equipment)})`,
    "เกร็งแกนกลางลำตัว ค่อย ๆ งอข้อศอกลดตัวลงจนอกเกือบแตะพื้น",
    "ดันตัวกลับขึ้นโดยออกแรงที่อกและแขน หายใจออกตอนดันขึ้น",
    "ทำซ้ำตามจำนวนครั้งที่กำหนด",
  ],
  squat: (ex) => [
    `ยืนแยกเท้ากว้างเท่าไหล่ (ใช้${translateEquipment(ex.equipment)})`,
    "ยื่นก้นไปด้านหลัง งอเข่าและสะโพกลงลึก รักษาหลังตรง",
    "เข่าชี้ทิศเดียวกับเท้า รู้สึกต้นขาหน้าและก้นทำงาน",
    "ดันผ่านส้นเท้ากลับขึ้นยืน หายใจออกตอนขึ้น",
    "ทำซ้ำตามจำนวนครั้งที่กำหนด",
  ],
  curl: (ex) => [
    `ยืนหรือนั่ง ถือ${translateEquipment(ex.equipment)} แขนข้างลำตัว`,
    "ให้ต้นแขนบนอยู่กับที่ งอข้อศอกยกน้ำหนักขึ้น",
    "บีบไบเซ็ปด้านบน หยุดค้างสักครู่",
    "ค่อย ๆ ลดน้ำหนักกลับ หายใจเข้าตอนลง",
    "ทำซ้ำตามจำนวนครั้งที่กำหนด",
  ],
  press: (ex) => [
    `จับ${translateEquipment(ex.equipment)}ในท่าเริ่มต้นที่เหมาะกับท่านี้`,
    `เกร็ง${translateMuscle(ex.target)} ดันหรือกดน้ำหนักตามทิศทางของท่า`,
    "อย่าแอร์ชหลัง คุมท่าให้ช้าและมั่นคง",
    "ค่อย ๆ กลับสู่ท่าเริ่มต้น",
    "ทำซ้ำตามจำนวนครั้งที่กำหนด",
  ],
  row: (ex) => [
    `ยืนหรือนั่ง จับ${translateEquipment(ex.equipment)}`,
    "หลังตรง ดึงน้ำหนักเข้าหาลำตัวโดยใช้ข้อศอก",
    `บีบ${translateMuscle(ex.target)}และสะบักตอนจุดหดตัว`,
    "ค่อย ๆ คืนแขมือยาว รู้สึกยืดที่หลัง",
    "ทำซ้ำตามจำนวนครั้งที่กำหนด",
  ],
  pullup: (ex) => [
    "จับบาร์กว้างกว่าไหล่ แขนยืดเต็มที่ ลำตัวห้อย",
    "ดึงลำตัวขึ้นจนเหนือบาร์หรือคางเกือบถึงบาร์",
    "บีบหลังและไบเซ็ป หยุดค้างด้านบน",
    "ค่อย ๆ ลดตัวลงจนแขนยืด ควบคุมการเคลื่อนไหว",
    "ทำซ้ำตามจำนวนครั้งที่กำหนด",
  ],
  plank: (ex) => [
    "คว่ำตัว งอข้อศอกรองลำตัว ปลายเท้าแตะพื้น",
    "ลำตัวเป็นเส้นตรง เกร็งกล้ามท้องและก้น",
    "อย่าให้สะโพกยกหรือหลุดลง หายใจสม่ำเสมอ",
    "ค้างท่าตามเวลาที่กำหนด",
  ],
  crunch: (ex) => [
    "นอนหงาย งอเข่า เท้าแบนราบพื้น มืออาจไว้หลังศีรษะหรือข้างลำตัว",
    "เกร็งกล้ามท้อง ยกหัวไหล่และส่วนบนของหลังออกจากพื้น",
    "อย่าดึงคอ รู้สึกหน้าท้องหดตัว",
    "ค่อย ๆ ลดลำตัวกลับ ไม่ต้องพักชนพื้นก็ได้",
    "ทำซ้ำตามจำนวนครั้งที่กำหนด",
  ],
  lunge: (ex) => [
    `ยืนแยกเท้ากว้างเท่าสะโพก (ใช้${translateEquipment(ex.equipment)})`,
    "ก้าวขาใดขาหนึ่งไปข้างหน้า งอทั้งสองเข่าลง",
    "เข่าหลังเกือบแตะพื้น ลำตัวตั้งตรง",
    "ดันตัวกลับยืน สลับขา",
    "ทำซ้ำตามจำนวนครั้งที่กำหนด",
  ],
  raise: (ex) => [
    `ยืนหรือนั่ง ถือ${translateEquipment(ex.equipment)}`,
    `ยกแขนหรือขาไปทิศทางของท่า โฟกัสที่${translateMuscle(ex.target)}`,
    "หยุดค้างด้านบนสักครู่ ไม่แกว่งตัวช่วย",
    "ค่อย ๆ ลดกลับสู่ท่าเริ่มต้น",
    "ทำซ้ำตามจำนวนครั้งที่กำหนด",
  ],
  extension: (ex) => [
    `จับ${translateEquipment(ex.equipment)} ต้นแขนบนอยู่กับที่`,
    `เหยียดแขนหรือขาโดยใช้${translateMuscle(ex.target)}`,
    "หยุดค้างตอนแขนยืดเกือบสุด ไม่ล็อกข้อต่อแข็ง",
    "ค่อย ๆ งอกลับ",
    "ทำซ้ำตามจำนวนครั้งที่กำหนด",
  ],
  generic: (ex) => [
    `เตรียมท่าออกกำลังกายสำหรับ${translateMuscle(ex.target)} ใช้${translateEquipment(ex.equipment)}`,
    `โฟกัสที่${translateMuscle(ex.target)} ทำช้า ๆ คุมท่าให้มั่นคง`,
    "หายใจออกตอนออกแรง หายใจเข้าตอนกลับท่า",
    "รักษาหลังให้ตรง ไม่ใช้แรงโยน",
    "ทำซ้ำตามจำนวนครั้งที่กำหนด",
  ],
};

export function generateFallbackThaiSteps(exercise: Exercise): string[] {
  const movement = detectMovement(exercise.name, exercise.category);
  return MOVEMENT_STEPS[movement](exercise);
}

function polishStep(text: string): string {
  let result = text;
  const entries = Object.entries({ ...MUSCLE_TH, ...EQUIPMENT_TH }).sort(
    (a, b) => b[0].length - a[0].length
  );
  for (const [en, th] of entries) {
    result = result.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), th);
  }
  return result;
}

export function translateSteps(
  enSteps: string[],
  exercise: Exercise,
  cache?: Record<string, string>
): string[] {
  const fallback = generateFallbackThaiSteps(exercise);

  if (enSteps.length === 0) return fallback;

  const translated = enSteps.map((s, i) => {
    const key = s.trim();
    if (cache?.[key] && !isMostlyEnglish(cache[key])) return polishStep(cache[key]);

    const offline = translateStepOffline(s, cache);
    if (!isMostlyEnglish(offline)) return polishStep(offline);

    return fallback[Math.min(i, fallback.length - 1)];
  });

  const badCount = translated.filter(isMostlyEnglish).length;
  if (badCount > translated.length / 2) return fallback;

  return translated.map((s, i) =>
    isMostlyEnglish(s) ? fallback[Math.min(i, fallback.length - 1)] : polishStep(s)
  );
}
