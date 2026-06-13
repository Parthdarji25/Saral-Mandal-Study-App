import {
  BarChart3,
  BookOpen,
  CalendarDays,
  FileText,
  GraduationCap,
  Home,
  Library,
  Megaphone,
  PenLine,
  ShieldCheck,
  Sparkles,
  FileQuestion,
  Users
} from "lucide-react";

export const subjectSyllabus = {
  Accountancy: [
    { title: "Introduction to Partnership", marks: 8 },
    { title: "Partnership Final Accounts", marks: 12 },
    { title: "Reconstitution of Partnership", marks: 15 },
    { title: "Dissolution of Partnership Firm", marks: 10 },
    { title: "Accounts of 'Not for Profit' Concerns", marks: 10 },
    { title: "Single Entry System", marks: 10 },
    { title: "Bill of Exchange", marks: 10 },
    { title: "Company Accounts", marks: 15 },
    { title: "Analysis of Financial Statements", marks: 10 }
  ],
  Economics: [
    { title: "Introduction to Microeconomics", section: "Microeconomics" },
    { title: "Consumer Behaviour", section: "Microeconomics" },
    { title: "Analysis of Demand, Elasticity of Demand", section: "Microeconomics" },
    { title: "Analysis of Supply", section: "Microeconomics" },
    { title: "Types of Market and Price Determination", section: "Microeconomics" },
    { title: "Factors of Production", section: "Microeconomics" },
    { title: "Introduction to Macroeconomics", section: "Macroeconomics" },
    { title: "National Income", section: "Macroeconomics" },
    { title: "Determinates of Aggregates", section: "Macroeconomics" },
    { title: "Money", section: "Macroeconomics" },
    { title: "Commercial Banks", section: "Macroeconomics" },
    { title: "Central Banks", section: "Macroeconomics" },
    { title: "Public Economics", section: "Macroeconomics" }
  ],
  OCM: [
    { title: "Principles of Management", marks: 10 },
    { title: "Functions of Management", marks: 15 },
    { title: "Business Environment", marks: 10 },
    { title: "Entrepreneurship Development", marks: 10 },
    { title: "Emerging Modes of Business", marks: 10 },
    { title: "Social Responsibilities of Business and Business Ethics", marks: 10 },
    { title: "Consumer Protection", marks: 10 },
    { title: "Marketing", marks: 15 }
  ],
  English: [
    { title: "Section One (Prose)", topics: "The Cop and the Anthem, The Gift of the Magi, The Open Window, The Bet, An Astrologer's Day", marks: 20 },
    { title: "Section Two (Poetry)", topics: "Song of the Open Road, Indian Weavers, Father Returning Home, Money Madness, The Inchcape Rock", marks: 20 },
    { title: "Section Three (Writing Skills)", topics: "Summary Writing, Note Making, Drafting a Virtual Message, Statement of Purpose, Group Discussion", marks: 20 },
    { title: "Section Four (Drama)", topics: "History of English Drama, Extracts from Plays, One-Act Plays", marks: 10 },
    { title: "Grammar and Vocabulary", marks: 15 },
    { title: "Listening, Speaking, Reading Skills", marks: 15 }
  ],
  "Mathematics & Statistics": []
} as const;

export const defaultSubjects = Object.keys(subjectSyllabus);

export const studentNav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/subjects", label: "Subjects", icon: Library },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/personal-notes", label: "My Notes", icon: PenLine },
  { href: "/scores", label: "Scores", icon: BarChart3 },
  { href: "/planner", label: "Planner", icon: CalendarDays },
  { href: "/quizzes", label: "Test Papers", icon: FileQuestion },
  { href: "/profile", label: "Profile", icon: GraduationCap }
];

export const adminNav = [
  { href: "/admin", label: "Overview", icon: ShieldCheck },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/subjects", label: "Subjects", icon: Library },
  { href: "/admin/notes", label: "Notes & PDFs", icon: BookOpen },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/quizzes", label: "Test Papers", icon: Sparkles }
];
