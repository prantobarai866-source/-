import {
  AcademicGroup,
  EvaluationItemResult,
  GradeLetter,
  StudentProfile,
  University,
  UniversityEvaluationResult,
} from '../types/admission';
import { UNIVERSITIES_DATABASE } from '../data/universities';

export const GRADE_POINTS: Record<GradeLetter, number> = {
  'A+': 5.0,
  'A': 4.0,
  'A-': 3.5,
  'B': 3.0,
  'C': 2.0,
  'D': 1.0,
  'F': 0.0,
};

export function getGradeLetterFromPoint(point: number): GradeLetter {
  if (point >= 5.0) return 'A+';
  if (point >= 4.0) return 'A';
  if (point >= 3.5) return 'A-';
  if (point >= 3.0) return 'B';
  if (point >= 2.0) return 'C';
  if (point >= 1.0) return 'D';
  return 'F';
}

export function getGroupLabelBn(group: AcademicGroup): string {
  switch (group) {
    case 'science':
      return 'বিজ্ঞান';
    case 'commerce':
      return 'ব্যবসায় শিক্ষা (বাণিজ্য)';
    case 'humanities':
      return 'মানবিক';
    default:
      return group;
  }
}

export function evaluateStudentEligibility(student: StudentProfile): UniversityEvaluationResult[] {
  const currentFirstTimeYear = 2026;
  const isFirstTimer = student.hscPassingYear === 2026;
  const isSecondTimer = student.hscPassingYear === 2025;
  const isGapYear = student.hscPassingYear < 2025;

  return UNIVERSITIES_DATABASE.map((univ) => {
    const unitsResult: EvaluationItemResult[] = univ.units.map((unit) => {
      const failureReasons: string[] = [];
      const successHighlights: string[] = [];

      // 1. Group / Department Check
      if (!unit.allowedGroups.includes(student.group)) {
        const allowedBn = unit.allowedGroups.map(getGroupLabelBn).join(', ');
        failureReasons.push(
          `বিভাগ/শাখা অমিল: শুধুমাত্র ${allowedBn} শাখার শিক্ষার্থীদের জন্য প্রযোজ্য (আপনার বিভাগ: ${getGroupLabelBn(student.group)})`
        );
      } else {
        successHighlights.push(`${getGroupLabelBn(student.group)} বিভাগের জন্য উন্মুক্ত`);
      }

      // 2. Passing Year & Second Time Policy
      const isHscYearAllowed = unit.allowedHscYears.includes(student.hscPassingYear);
      const isSecondTimeAllowed = unit.allowedHscYears.includes(2025);

      if (!isHscYearAllowed) {
        if (isSecondTimer && !isSecondTimeAllowed) {
          failureReasons.push(
            `২য় বার (Second Time) পরীক্ষা দেওয়ার সুযোগ নেই। এই ইউনিটে শুধুমাত্র এইচএসসি ${currentFirstTimeYear} (১ম বার / ২৬ ব্যাচ) পরীক্ষার্থীরা আবেদন করতে পারবে।`
          );
        } else if (isGapYear) {
          failureReasons.push(
            `এইচএসসি পাসের সাল অতিক্রম করেছে। অনুমোদিত পাসের সাল: ${unit.allowedHscYears.join(', ')} (আপনার সাল: ${student.hscPassingYear})`
          );
        } else {
          failureReasons.push(
            `পাসের সাল অনুমোদিত তালিকার অন্তর্ভুক্ত নয় (আপনার সাল: ${student.hscPassingYear}, অনুমোদিত: ${unit.allowedHscYears.join(', ')})`
          );
        }
      } else {
        if (isFirstTimer) {
          successHighlights.push(`১ম বার (২৬ ব্যাচ) পরীক্ষার্থী হিসেবে পাসের সাল বৈধ (${student.hscPassingYear})`);
        } else if (isSecondTimer) {
          successHighlights.push(`২য় বার (২৫ ব্যাচ / Second Timer) শিক্ষার্থীদের আবেদনের সুযোগ রয়েছে`);
        } else {
          successHighlights.push(`অনুমোদিত পাসের সাল (${student.hscPassingYear})`);
        }
      }

      // 3. Minimum GPA Rules (with Quota relaxation support)
      let requiredSscGpa = unit.minSscGpa;
      let requiredHscGpa = unit.minHscGpa;
      let requiredTotalGpa = unit.minTotalGpa;

      // Group-based relaxation for arts/business in general universities (e.g. DU, CU)
      if (unit.unitId === 'du-arts') {
        if (student.group === 'science') {
          requiredSscGpa = 3.50;
          requiredHscGpa = 3.50;
          requiredTotalGpa = 8.00;
        } else {
          requiredSscGpa = 3.00;
          requiredHscGpa = 3.00;
          requiredTotalGpa = 7.50;
        }
      }

      if (student.isTribalQuota && unit.quotaRelaxation) {
        requiredSscGpa = unit.quotaRelaxation.minSscGpa;
        requiredHscGpa = unit.quotaRelaxation.minHscGpa;
        requiredTotalGpa = unit.quotaRelaxation.minTotalGpa;
      }

      const totalStudentGpa = Number((student.sscGpa + student.hscGpa).toFixed(2));

      // HSC GPA Check
      if (student.hscGpa < requiredHscGpa) {
        const gap = (requiredHscGpa - student.hscGpa).toFixed(2);
        failureReasons.push(
          `এইচএসসি জিপিএ ${gap} কম (প্রয়োজন ন্যূনতম ${requiredHscGpa.toFixed(2)}, আপনার প্রাপ্ত ${student.hscGpa.toFixed(2)})`
        );
      } else {
        successHighlights.push(`এইচএসসি জিপিএ শর্ত পূরণ (প্রয়োজন ${requiredHscGpa.toFixed(2)}, প্রাপ্ত ${student.hscGpa.toFixed(2)})`);
      }

      // SSC GPA Check
      if (student.sscGpa < requiredSscGpa) {
        const gap = (requiredSscGpa - student.sscGpa).toFixed(2);
        failureReasons.push(
          `এসএসসি জিপিএ ${gap} কম (প্রয়োজন ন্যূনতম ${requiredSscGpa.toFixed(2)}, আপনার প্রাপ্ত ${student.sscGpa.toFixed(2)})`
        );
      } else {
        successHighlights.push(`এসএসসি জিপিএ শর্ত পূরণ (প্রয়োজন ${requiredSscGpa.toFixed(2)}, প্রাপ্ত ${student.sscGpa.toFixed(2)})`);
      }

      // Total GPA Check
      if (totalStudentGpa < requiredTotalGpa) {
        const gap = (requiredTotalGpa - totalStudentGpa).toFixed(2);
        failureReasons.push(
          `মোট জিপিএ ${gap} কম (এসএসসি ও এইচএসসি মিলে প্রয়োজন ${requiredTotalGpa.toFixed(2)}, আপনার প্রাপ্ত ${totalStudentGpa.toFixed(2)})`
        );
      } else {
        successHighlights.push(`মোট জিপিএ শর্ত পূরণ (প্রয়োজন ${requiredTotalGpa.toFixed(2)}, আপনার মোট ${totalStudentGpa.toFixed(2)})`);
      }

      // 4. Subject-wise Grade Checks (Only if student is in Science for science units, etc.)
      if (student.group === 'science') {
        const phys = student.subjects.physics;
        const chem = student.subjects.chemistry;
        const math = student.subjects.math;
        const bio = student.subjects.biology;
        const eng = student.subjects.english;

        // Individual subject rules
        if (unit.subjects) {
          if (unit.subjects.physics && unit.subjects.physics.minGp) {
            if (phys.gradePoint < unit.subjects.physics.minGp) {
              failureReasons.push(
                `পদার্থবিজ্ঞানে ন্যূনতম GP ${unit.subjects.physics.minGp.toFixed(2)} (${unit.subjects.physics.minGradeLetter || ''}) নেই (আপনার প্রাপ্ত GP ${phys.gradePoint.toFixed(2)} / ${phys.gradeLetter})`
              );
            }
          }
          if (unit.subjects.chemistry && unit.subjects.chemistry.minGp) {
            if (chem.gradePoint < unit.subjects.chemistry.minGp) {
              failureReasons.push(
                `রসায়নে ন্যূনতম GP ${unit.subjects.chemistry.minGp.toFixed(2)} (${unit.subjects.chemistry.minGradeLetter || ''}) নেই (আপনার প্রাপ্ত GP ${chem.gradePoint.toFixed(2)} / ${chem.gradeLetter})`
              );
            }
          }
          if (unit.subjects.math && unit.subjects.math.minGp) {
            if (math.gradePoint < unit.subjects.math.minGp) {
              failureReasons.push(
                `উচ্চতর গণিতে ন্যূনতম GP ${unit.subjects.math.minGp.toFixed(2)} (${unit.subjects.math.minGradeLetter || ''}) নেই (আপনার প্রাপ্ত GP ${math.gradePoint.toFixed(2)} / ${math.gradeLetter})`
              );
            }
          }
          if (unit.subjects.biology && unit.subjects.biology.minGp) {
            let requiredBioGp = unit.subjects.biology.minGp;
            if (student.isTribalQuota && unit.quotaRelaxation?.biologyMinGp) {
              requiredBioGp = unit.quotaRelaxation.biologyMinGp;
            }
            if (bio.gradePoint < requiredBioGp) {
              failureReasons.push(
                `জীববিজ্ঞানে ন্যূনতম GP ${requiredBioGp.toFixed(2)} (${unit.subjects.biology.minGradeLetter || 'A'}) নেই (আপনার প্রাপ্ত GP ${bio.gradePoint.toFixed(2)} / ${bio.gradeLetter})`
              );
            } else {
              successHighlights.push(`জীববিজ্ঞানে ন্যূনতম GP ${requiredBioGp.toFixed(2)} বিদ্যমান (প্রাপ্ত ${bio.gradePoint.toFixed(2)})`);
            }
          }
          if (unit.subjects.english && unit.subjects.english.minGp) {
            if (eng.gradePoint < unit.subjects.english.minGp) {
              failureReasons.push(
                `ইংরেজিতে ন্যূনতম GP ${unit.subjects.english.minGp.toFixed(2)} (${unit.subjects.english.minGradeLetter || ''}) নেই (আপনার প্রাপ্ত GP ${eng.gradePoint.toFixed(2)} / ${eng.gradeLetter})`
              );
            }
          }
        }

        // Composite rules (BUET, CKRUET, BUTEX, MIST)
        if (unit.compositeRules) {
          const pcmTotal = Number((phys.gradePoint + chem.gradePoint + math.gradePoint).toFixed(2));
          const pcmeTotal = Number((pcmTotal + eng.gradePoint).toFixed(2));

          if (unit.compositeRules.pcmMinTotalGp) {
            if (pcmTotal < unit.compositeRules.pcmMinTotalGp) {
              const gap = (unit.compositeRules.pcmMinTotalGp - pcmTotal).toFixed(2);
              failureReasons.push(
                `পদার্থ, রসায়ন ও গণিতে মোট জিপি ${gap} কম (প্রয়োজন ১৫.০০ পয়েন্ট / ৩টিতেই A+, আপনার প্রাপ্ত ${pcmTotal.toFixed(2)})`
              );
            } else {
              successHighlights.push(`পদার্থ, রসায়ন ও উচ্চতর গণিতে পূর্ণ ১৫.০০ পয়েন্ট (A+) রয়েছে`);
            }
          }

          if (unit.compositeRules.pcmeMinTotalGp) {
            if (pcmeTotal < unit.compositeRules.pcmeMinTotalGp) {
              const gap = (unit.compositeRules.pcmeMinTotalGp - pcmeTotal).toFixed(2);
              failureReasons.push(
                `পদার্থ, রসায়ন, গণিত ও ইংরেজিতে মোট জিপি ${gap} কম (প্রয়োজন ${unit.compositeRules.pcmeMinTotalGp.toFixed(2)}, আপনার প্রাপ্ত ${pcmeTotal.toFixed(2)})`
              );
            } else {
              successHighlights.push(
                `পদার্থ, রসায়ন, গণিত ও ইংরেজিতে সন্তোষজনক পয়েন্ট রয়েছে (প্রাপ্ত ${pcmeTotal.toFixed(2)})`
              );
            }
          }
        }
      }

      // English checks for IBA / Business / Law
      if (unit.subjects?.english && student.group !== 'science') {
        const eng = student.subjects.english;
        if (unit.subjects.english.minGp && eng.gradePoint < unit.subjects.english.minGp) {
          failureReasons.push(
            `ইংরেজিতে ন্যূনতম GP ${unit.subjects.english.minGp.toFixed(2)} নেই (আপনার প্রাপ্ত GP ${eng.gradePoint.toFixed(2)})`
          );
        }
      }

      const isEligible = failureReasons.length === 0;

      return {
        unitId: unit.unitId,
        unitCode: unit.unitCode,
        unitNameBn: unit.unitNameBn,
        isEligible,
        failureReasons,
        successHighlights,
        isSecondTimeAllowed,
        isSecondTimer,
        markDeductionNote: isSecondTimer && unit.markDeductionSecondTimer ? unit.markDeductionSecondTimer : undefined,
        notesBn: unit.notesBn,
      };
    });

    const eligibleUnitCount = unitsResult.filter((u) => u.isEligible).length;

    return {
      university: univ,
      unitsResult,
      isEligibleAnyUnit: eligibleUnitCount > 0,
      eligibleUnitCount,
      totalUnitCount: unitsResult.length,
    };
  });
}
