import type { HealthReport, HealthFinding, HealthAnalysis } from "@/types/health";
import { calculateBMI } from "./body-analysis";

function finding(
  partial: Omit<HealthFinding, "id"> & { id?: string }
): HealthFinding {
  return { id: partial.id ?? crypto.randomUUID(), ...partial };
}

export function analyzeHealthReport(report: HealthReport): HealthAnalysis {
  const findings: HealthFinding[] = [];
  const gender = report.gender ?? "male";
  const bmi =
    report.bmi ??
    (report.weight && report.height
      ? calculateBMI(report.weight, report.height)
      : undefined);

  if (bmi !== undefined) {
    if (bmi >= 30) {
      findings.push(
        finding({
          category: "obesity",
          severity: "high",
          label: `ภาวะอ้วน (BMI ${bmi})`,
          value: bmi,
          unit: "kg/m²",
          normalRange: "18.5–22.9",
          recommendation:
            "ควรลดน้ำหนักอย่างค่อยเป็นค่อยไป ออกกำลังกายสม่ำเสมอ และควบคุมอาหาร",
        })
      );
    } else if (bmi >= 25) {
      findings.push(
        finding({
          category: "overweight",
          severity: "borderline",
          label: `น้ำหนักเกิน (BMI ${bmi})`,
          value: bmi,
          unit: "kg/m²",
          normalRange: "18.5–22.9",
          recommendation: "ควรลดน้ำหนักและเพิ่มกิจกรรมทางกาย",
        })
      );
    }
  }

  const waistThreshold = gender === "male" ? 90 : 80;
  if (report.waist && report.waist > waistThreshold) {
    findings.push(
      finding({
        category: "metabolic_syndrome",
        severity: "high",
        label: `รอบเอวสูง (${report.waist} cm)`,
        value: report.waist,
        unit: "cm",
        normalRange: gender === "male" ? "< 90" : "< 80",
        recommendation: "เสี่ยง metabolic syndrome ควรลดไขมันหน้าท้องและเพิ่มคาร์ดิโอ",
      })
    );
  }

  const { labs } = report;
  if (labs.totalCholesterol && labs.totalCholesterol > 200) {
    findings.push(
      finding({
        category: "hyperlipidemia",
        severity: labs.totalCholesterol > 240 ? "high" : "borderline",
        label: `คอเลสเตอรอลรวมสูง (${labs.totalCholesterol} mg/dL)`,
        value: labs.totalCholesterol,
        unit: "mg/dL",
        normalRange: "< 200",
        recommendation: "หลีกเลี่ยงเนื้อแดง เนย อาหารทอด และออกกำลังกายสม่ำเสมอ",
      })
    );
  }

  if (labs.ldl && labs.ldl > 130) {
    findings.push(
      finding({
        category: "hyperlipidemia",
        severity: "high",
        label: `LDL สูง (${labs.ldl} mg/dL)`,
        value: labs.ldl,
        unit: "mg/dL",
        normalRange: "< 130",
        recommendation: "ลดไขมันอิ่มตัว เพิ่มไฟเบอร์ และออกกำลังกายแบบแอโรบิก",
      })
    );
  }

  if (labs.fastingGlucose) {
    if (labs.fastingGlucose >= 126) {
      findings.push(
        finding({
          category: "prediabetes",
          severity: "high",
          label: `น้ำตาลสูง (${labs.fastingGlucose} mg/dL)`,
          value: labs.fastingGlucose,
          unit: "mg/dL",
          normalRange: "70–99",
          recommendation: "ปรึกษาแพทย์และควบคุมคาร์โบไฮเดรต",
        })
      );
    } else if (labs.fastingGlucose >= 100) {
      findings.push(
        finding({
          category: "prediabetes",
          severity: "borderline",
          label: `น้ำตาลสูงกว่าปกติ (${labs.fastingGlucose} mg/dL)`,
          value: labs.fastingGlucose,
          unit: "mg/dL",
          normalRange: "70–99",
          recommendation: "ระวังเบาหวาน ลดน้ำตาลและคาร์โบไฮเดรตขัดขาว",
        })
      );
    }
  }

  if (
    report.bloodPressureSystolic &&
    report.bloodPressureSystolic >= 140
  ) {
    findings.push(
      finding({
        category: "hypertension",
        severity: "high",
        label: `ความดันโลหิตสูง (${report.bloodPressureSystolic}/${report.bloodPressureDiastolic ?? "?"})`,
        value: report.bloodPressureSystolic,
        unit: "mmHg",
        normalRange: "< 120/80",
        recommendation: "ลดโซเดียม ออกกำลังกายเบาๆ และติดตามความดัน",
      })
    );
  }

  if (report.sedentary) {
    findings.push(
      finding({
        category: "low_fitness",
        severity: "borderline",
        label: "ไม่เคยออกกำลังกาย",
        value: 0,
        unit: "",
        normalRange: "3–5 ครั้ง/สัปดาห์",
        recommendation: "เริ่มเดินเร็ว 30 นาที 3–5 ครั้งต่อสัปดาห์",
      })
    );
  }

  if (report.familyDiabetesHistory) {
    findings.push(
      finding({
        category: "prediabetes",
        severity: "borderline",
        label: "ประวัติเบาหวานในครอบครัว",
        value: 0,
        unit: "",
        normalRange: "ไม่มี",
        recommendation: "ระวังเบาหวาน เน้นอาหาร low-GI และตรวจน้ำตาลสม่ำเสมอ",
      })
    );
  }

  const healthFocusAreas = new Set<string>();
  const dietaryRestrictions = new Set<string>();
  const priorityGoals: string[] = [];

  for (const f of findings) {
    switch (f.category) {
      case "obesity":
      case "overweight":
        priorityGoals.push("lose_fat");
        healthFocusAreas.add("waist");
        healthFocusAreas.add("cardio");
        healthFocusAreas.add("upper legs");
        break;
      case "hyperlipidemia":
        priorityGoals.push("reduce_cholesterol");
        healthFocusAreas.add("cardio");
        dietaryRestrictions.add("high-saturated-fat");
        dietaryRestrictions.add("fried");
        dietaryRestrictions.add("red-meat");
        break;
      case "metabolic_syndrome":
        healthFocusAreas.add("waist");
        healthFocusAreas.add("cardio");
        dietaryRestrictions.add("high-sugar");
        break;
      case "prediabetes":
        dietaryRestrictions.add("high-sugar");
        healthFocusAreas.add("waist");
        break;
      case "low_fitness":
        healthFocusAreas.add("cardio");
        break;
    }
  }

  if (priorityGoals.length === 0) priorityGoals.push("maintain");

  const highCount = findings.filter((f) => f.severity === "high").length;
  const summary =
    findings.length === 0
      ? "ผลตรวจอยู่ในเกณฑ์ดี"
      : highCount > 0
        ? `พบ ${highCount} ประเด็นที่ต้องให้ความสำคัญ — ระบบได้ปรับแผนให้แล้ว`
        : `พบ ${findings.length} ประเด็นที่ควรติดตาม`;

  return {
    findings,
    priorityGoals: [...new Set(priorityGoals)],
    healthFocusAreas: [...healthFocusAreas],
    dietaryRestrictions: [...dietaryRestrictions],
    summary,
  };
}
