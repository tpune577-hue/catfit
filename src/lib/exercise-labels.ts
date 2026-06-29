export const MUSCLE_TH: Record<string, string> = {
  abs: "กล้ามท้อง",
  biceps: "ไบเซ็ป",
  triceps: "ไตรเซ็ป",
  pectorals: "กล้ามอก",
  "pectoralis major": "กล้ามอกใหญ่",
  lats: "กล้ามหลัง",
  deltoids: "กล้ามไหล่",
  delts: "กล้ามไหล่",
  glutes: "ก้น",
  quadriceps: "ต้นขาหน้า",
  quads: "ต้นขาหน้า",
  hamstrings: "ต้นขาหลัง",
  calves: "น่อง",
  traps: "กล้ามหลังบน",
  "upper back": "หลังบน",
  "lower back": "หลังล่าง",
  forearms: "ปลายแขน",
  "hip flexors": "สะโพกต้นขา",
  "cardiovascular system": "หัวใจและหลอดเลือด",
  spine: "กระดูกสันหลัง",
  "serratus anterior": "กล้ามข้างลำตัว",
  adductors: "กล้ามขาด้านใน",
  abductors: "กล้ามขาด้านนอก",
  "soleus": "น่อง",
  "levator scapulae": "กล้ามคอ-สะบัก",
};

export const CATEGORY_TH: Record<string, string> = {
  waist: "หน้าท้อง",
  chest: "อก",
  back: "หลัง",
  shoulders: "ไหล่",
  "upper arms": "แขน",
  "upper legs": "ขา",
  "lower legs": "น่อง",
  cardio: "คาร์ดิโอ",
  neck: "คอ",
};

export const EQUIPMENT_TH: Record<string, string> = {
  "body weight": "น้ำหนักตัว",
  dumbbell: "ดัมเบล",
  barbell: "บาร์เบล",
  cable: "เคเบิล",
  machine: "เครื่องออกกำลังกาย",
  "resistance band": "ยางยืด",
  band: "ยางยืด",
  kettlebell: "เคตเทิลเบล",
  "medicine ball": "บอลออกกำลังกาย",
  "stability ball": "บอลโยคะ",
  "bosu ball": "บอลโบซุ",
  "ez barbell": "บาร์เบล EZ",
  rope: "เชือก",
  "smith machine": "เครื่องสมิธ",
  "leverage machine": "เครื่องออกกำลังกาย",
  "olympic barbell": "บาร์เบลโอลิมปิก",
  "sled machine": "เครื่องเลื่อนน้ำหนัก",
  "elliptical machine": "เครื่องอีลิปติคอล",
  "stationary bike": "จักรยานออกกำลังกาย",
  "stepmill machine": "เครื่องสเต็ปมิลล์",
  "skierg machine": "เครื่องสกีอาร์จี",
  "upper body ergometer": "เครื่องบังคับแขน",
  "trap bar": "ทรัพบาร์",
  "wheel roller": "ลูกกลิ้งโยคะ",
  roller: "ลูกกลิ้ง",
  hammer: "ค้อนออกกำลังกาย",
  tire: "ยางรถ",
  weighted: "ถ่วงน้ำหนัก",
  assisted: "เครื่องช่วย",
};

export function translateMuscle(muscle: string): string {
  return MUSCLE_TH[muscle.toLowerCase()] ?? muscle;
}

export function translateCategory(category: string): string {
  return CATEGORY_TH[category.toLowerCase()] ?? category;
}

export function translateEquipment(equipment: string): string {
  return EQUIPMENT_TH[equipment.toLowerCase()] ?? equipment;
}
