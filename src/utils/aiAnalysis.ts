interface OnboardingData {
  educationLevel: string;
  strongestSubjects: string[];
  industriesOfInterest: string[];
  dreamCareer: string;
  preferredPath: string;
  focusLevel: number;
  timeManagement: number;
  studySupport: string[];
  reminderFrequency: string;
}

interface AIAnalysis {
  personalityType: string;
  careerMatch: string;
  recommendedPath: string;
}

const personalityMapping: Record<string, string[]> = {
  "Logical Thinker": [
    "Mathematics",
    "Physics",
    "ICT/Computer Studies",
    "Chemistry",
  ],
  "Creative Visionary": ["Art & Design", "Literature", "English"],
  "People-Oriented": ["English", "History", "Business Studies", "Economics"],
  "Analytical Problem-Solver": ["Chemistry", "Biology", "Geography"],
  "Practical Builder": ["Agriculture", "Geography", "Physics"],
};

const careerMapping: Record<string, string[]> = {
  "Technology & ICT": [
    "Software Engineer",
    "Data Analyst",
    "ICT Specialist",
    "Web Developer",
  ],
  "Healthcare & Medicine": [
    "Doctor",
    "Nurse",
    "Medical Technician",
    "Pharmacist",
  ],
  "Business & Finance": [
    "Accountant",
    "Business Analyst",
    "Entrepreneur",
    "Financial Advisor",
  ],
  "Agriculture & Food": [
    "Agricultural Engineer",
    "Food Scientist",
    "Farm Manager",
  ],
  "Education & Training": [
    "Teacher",
    "Education Coordinator",
    "Training Specialist",
  ],
  "Tourism & Hospitality": ["Hotel Manager", "Tour Guide", "Event Coordinator"],
  "Engineering & Construction": [
    "Civil Engineer",
    "Architect",
    "Project Manager",
  ],
  "Media & Communications": ["Journalist", "Content Creator", "PR Specialist"],
};

const pathMapping: Record<string, Record<string, string>> = {
  employment: {
    "Technology & ICT":
      "ICT Certificate → Bachelor in IT → Junior Developer → Senior Developer",
    "Healthcare & Medicine":
      "Form 6 → Medical School → Internship → Licensed Doctor",
    "Business & Finance":
      "Business Diploma → Bachelor in Business → Entry-level → Management",
  },
  self_employment: {
    "Technology & ICT": "Coding Bootcamp → Freelance Projects → Tech Startup",
    "Healthcare & Medicine": "Medical Training → Private Practice Setup",
    "Business & Finance": "Business Skills → Small Business → Scale Up",
  },
  investor: {
    "Technology & ICT": "Learn Investing → Tech Stocks → Angel Investing",
    "Healthcare & Medicine": "Healthcare REITs → Medical Equipment Investment",
    "Business & Finance":
      "Financial Education → Portfolio Building → Real Estate",
  },
};

function determinePersonality(subjects: string[]): string {
  const scores: Record<string, number> = {};

  // Calculate scores for each personality type
  Object.entries(personalityMapping).forEach(
    ([personality, relatedSubjects]) => {
      scores[personality] = subjects.filter((subject) =>
        relatedSubjects.includes(subject)
      ).length;
    }
  );

  // Return personality with highest score, or default
  const topPersonality = Object.entries(scores).reduce((a, b) =>
    scores[a[0]] > scores[b[0]] ? a : b
  )[0];

  return scores[topPersonality] > 0 ? topPersonality : "Balanced Learner";
}

function getCareerMatch(industry: string, dreamCareer: string): string {
  // If user specified a dream career, use it
  if (dreamCareer && dreamCareer.trim().length > 0) {
    return dreamCareer.trim();
  }

  // Otherwise, suggest based on industry
  const careers = careerMapping[industry];
  return careers ? careers[0] : "Career Explorer";
}

function generatePath(
  educationLevel: string,
  industry: string,
  preferredPath: string
): string {
  const paths = pathMapping[preferredPath];
  if (paths && paths[industry]) {
    return paths[industry];
  }

  // Default path based on education level
  if (educationLevel.includes("Primary")) {
    return "Complete Secondary → Certificate Course → Entry Level Position";
  } else if (educationLevel.includes("Form 4")) {
    return "Form 6 → University/College → Professional Career";
  } else if (educationLevel.includes("Form 6")) {
    return "University Degree → Internship → Professional Role";
  }

  return "Skill Development → Experience Building → Career Growth";
}

export function generateAIAnalysis(data: OnboardingData): AIAnalysis {
  const personalityType = determinePersonality(data.strongestSubjects);
  const careerMatch = getCareerMatch(
    data.industriesOfInterest[0] || "",
    data.dreamCareer
  );
  const recommendedPath = generatePath(
    data.educationLevel,
    data.industriesOfInterest[0] || "",
    data.preferredPath
  );

  return {
    personalityType,
    careerMatch,
    recommendedPath,
  };
}
