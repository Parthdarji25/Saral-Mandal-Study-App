export type UserRole = "student" | "admin";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          xp_points: number;
          study_streak: number;
          onboarding_completed: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          xp_points?: number;
          study_streak?: number;
          onboarding_completed?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      subjects: {
        Row: { id: string; name: string; description: string | null; created_at: string };
        Insert: { id?: string; name: string; description?: string | null; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["subjects"]["Insert"]>;
      };
      chapters: {
        Row: { id: string; subject_id: string; title: string; chapter_number: number; created_at: string };
        Insert: { id?: string; subject_id: string; title: string; chapter_number: number; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["chapters"]["Insert"]>;
      };
      public_notes: {
        Row: {
          id: string;
          subject_id: string;
          chapter_id: string | null;
          title: string;
          content: string;
          pdf_url: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          subject_id: string;
          chapter_id?: string | null;
          title: string;
          content: string;
          pdf_url?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["public_notes"]["Insert"]>;
      };
      announcements: {
        Row: { id: string; title: string; description: string; created_at: string };
        Insert: { id?: string; title: string; description: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["announcements"]["Insert"]>;
      };
      student_scores: {
        Row: {
          id: string;
          user_id: string;
          subject_id: string;
          test_name: string;
          marks_obtained: number;
          total_marks: number;
          test_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          subject_id: string;
          test_name: string;
          marks_obtained: number;
          total_marks: number;
          test_date: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["student_scores"]["Insert"]>;
      };
      personal_notes: {
        Row: { id: string; user_id: string; title: string; content: string; created_at: string; updated_at: string };
        Insert: { id?: string; user_id?: string; title: string; content: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["personal_notes"]["Insert"]>;
      };
      bookmarks: {
        Row: { id: string; user_id: string; note_id: string; created_at: string };
        Insert: { id?: string; user_id?: string; note_id: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["bookmarks"]["Insert"]>;
      };
      study_tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          due_date: string | null;
          status: "todo" | "doing" | "done";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          title: string;
          description?: string | null;
          due_date?: string | null;
          status?: "todo" | "doing" | "done";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["study_tasks"]["Insert"]>;
      };
      quizzes: {
        Row: { id: string; subject_id: string; title: string; created_at: string };
        Insert: { id?: string; subject_id: string; title: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["quizzes"]["Insert"]>;
      };
      quiz_questions: {
        Row: {
          id: string;
          quiz_id: string;
          question: string;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          correct_answer: "a" | "b" | "c" | "d";
          created_at: string;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          question: string;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          correct_answer: "a" | "b" | "c" | "d";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["quiz_questions"]["Insert"]>;
      };
      study_sessions: {
        Row: { id: string; user_id: string; studied_on: string; minutes: number; created_at: string };
        Insert: { id?: string; user_id?: string; studied_on?: string; minutes?: number; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["study_sessions"]["Insert"]>;
      };
      achievements: {
        Row: { id: string; code: string; title: string; description: string; xp_reward: number; created_at: string };
        Insert: { id?: string; code: string; title: string; description: string; xp_reward?: number; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["achievements"]["Insert"]>;
      };
      student_achievements: {
        Row: { id: string; user_id: string; achievement_id: string; unlocked_at: string };
        Insert: { id?: string; user_id?: string; achievement_id: string; unlocked_at?: string };
        Update: Partial<Database["public"]["Tables"]["student_achievements"]["Insert"]>;
      };
      student_chapter_progress: {
        Row: {
          id: string;
          user_id: string;
          subject_name: string;
          chapter_number: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          subject_name: string;
          chapter_number: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["student_chapter_progress"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      task_status: "todo" | "doing" | "done";
    };
  };
};
