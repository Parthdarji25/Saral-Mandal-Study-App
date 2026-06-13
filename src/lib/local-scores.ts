export type ScoreEntry = {
  id: string;
  subject: string;
  testName: string;
  marks: number;
  total: number;
  date: string;
};

export const scoreUpdatedEvent = "commerce-study-hub-scores-updated";

export const zeroMonthlyScores = [
  { month: "Jan", score: 0 },
  { month: "Feb", score: 0 },
  { month: "Mar", score: 0 },
  { month: "Apr", score: 0 },
  { month: "May", score: 0 }
];

export function mapDatabaseScore(row: {
  id: string;
  test_name: string;
  marks_obtained: number;
  total_marks: number;
  test_date: string;
  subjects?: { name?: string | null } | Array<{ name?: string | null }> | null;
}): ScoreEntry {
  const subject = Array.isArray(row.subjects) ? row.subjects[0] : row.subjects;

  return {
    id: row.id,
    subject: subject?.name ?? "Unknown",
    testName: row.test_name,
    marks: Number(row.marks_obtained),
    total: Number(row.total_marks),
    date: row.test_date
  };
}

export function getSubjectAverages(scores: ScoreEntry[], subjects: string[]) {
  const subjectNames = subjects.length > 0 ? subjects : Array.from(new Set(scores.map((score) => score.subject)));
  const zeroSubjectScores = subjectNames.map((subject) => ({ subject, score: 0, month: subject }));

  if (scores.length === 0) return zeroSubjectScores;

  return subjectNames.map((subject) => {
    const subjectScores = scores.filter((score) => score.subject === subject);
    const average =
      subjectScores.length === 0
        ? 0
        : subjectScores.reduce((sum, score) => sum + (score.marks / score.total) * 100, 0) / subjectScores.length;

    return { subject, score: Math.round(average) };
  });
}

export function getLatestScoreTrend(scores: ScoreEntry[]) {
  if (scores.length === 0) return zeroMonthlyScores;

  return scores
    .slice(0, 5)
    .reverse()
    .map((score) => ({
      month: score.testName,
      score: Math.round((score.marks / score.total) * 100)
    }));
}

export function getAverageScore(scores: ScoreEntry[]) {
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((sum, score) => sum + (score.marks / score.total) * 100, 0) / scores.length);
}

export function getStrongSubject(subjectScores: Array<{ subject: string; score: number }>) {
  const ranked = subjectScores.filter((item) => item.score > 0).sort((a, b) => b.score - a.score);
  return ranked[0]?.subject ?? "Add first score";
}
