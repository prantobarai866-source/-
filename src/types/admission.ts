export type AcademicGroup = 'science' | 'commerce' | 'humanities';

export type UniversityCategory = 
  | 'engineering' 
  | 'medical' 
  | 'general_public' 
  | 'gst_cluster' 
  | 'agri_cluster' 
  | 'specialized' 
  | 'national' 
  | 'private';

export type GradeLetter = 'A+' | 'A' | 'A-' | 'B' | 'C' | 'D' | 'F';

export interface SubjectGrade {
  gradeLetter: GradeLetter;
  gradePoint: number;
}

export interface StudentProfile {
  studentName: string;
  sscGpa: number;
  hscGpa: number;
  sscPassingYear: number;
  hscPassingYear: number;
  group: AcademicGroup;
  isTribalQuota: boolean; // পার্বত্য জেলা / ক্ষুদ্র নৃগোষ্ঠী কোটা
  subjects: {
    physics: SubjectGrade;
    chemistry: SubjectGrade;
    math: SubjectGrade;
    biology: SubjectGrade;
    english: SubjectGrade;
    bangla: SubjectGrade;
    accounting?: SubjectGrade;
    economics?: SubjectGrade;
  };
}

export interface SubjectRequirementRule {
  minGp?: number;
  minGradeLetter?: GradeLetter;
  required?: boolean;
  nameBn: string;
}

export interface UnitRequirement {
  unitId: string;
  unitCode: string; // e.g. "A Unit", "ক ইউনিট"
  unitNameBn: string;
  allowedGroups: AcademicGroup[];
  allowedHscYears: number[]; // e.g. [2024] for 1st timer, [2024, 2023] for 2nd timer
  allowedSscYears?: number[];
  minSscGpa: number;
  minHscGpa: number;
  minTotalGpa: number;
  
  // Specific subject checks
  subjects?: {
    physics?: SubjectRequirementRule;
    chemistry?: SubjectRequirementRule;
    math?: SubjectRequirementRule;
    biology?: SubjectRequirementRule;
    english?: SubjectRequirementRule;
    bangla?: SubjectRequirementRule;
    accounting?: SubjectRequirementRule;
  };

  // Grouped subject requirements (e.g. PCM total 15 for BUET, PCME total 18 for BUTEX)
  compositeRules?: {
    pcmMinTotalGp?: number; // Physics + Chemistry + Math
    pcmeMinTotalGp?: number; // Physics + Chemistry + Math + English
    allAInPCM?: boolean; // Must have A+ in Math, Phys, Chem
    customConditionBn?: string;
  };

  markDeductionSecondTimer?: string; // e.g. "২য় বার শিক্ষার্থীদের জন্য ৫ নম্বর কর্তন"
  quotaRelaxation?: {
    minSscGpa: number;
    minHscGpa: number;
    minTotalGpa: number;
    biologyMinGp?: number;
    noteBn: string;
  };
  seatsEstimate?: number;
  notesBn?: string;
}

export interface University {
  id: string;
  nameBn: string;
  nameEn: string;
  shortName: string;
  category: UniversityCategory;
  categoryNameBn: string;
  locationBn: string;
  websiteUrl: string;
  admissionCircularUrl?: string;
  badgeText?: string;
  descriptionBn: string;
  units: UnitRequirement[];
}

export interface EvaluationItemResult {
  unitId: string;
  unitCode: string;
  unitNameBn: string;
  isEligible: boolean;
  failureReasons: string[];
  successHighlights: string[];
  isSecondTimeAllowed: boolean;
  isSecondTimer: boolean;
  markDeductionNote?: string;
  notesBn?: string;
}

export interface UniversityEvaluationResult {
  university: University;
  unitsResult: EvaluationItemResult[];
  isEligibleAnyUnit: boolean;
  eligibleUnitCount: number;
  totalUnitCount: number;
}
