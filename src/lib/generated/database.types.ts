export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      answers: {
        Row: {
          game_played_id: number
          user_id: string
          correct: boolean
          question_data: Json | null
          question_type: number
          num_tries: number | null
          created_at: string
          id: number
        }
        Insert: {
          game_played_id: number
          user_id: string
          correct: boolean
          question_data?: Json | null
          question_type: number
          num_tries?: number | null
          created_at?: string
          id?: number
        }
        Update: {
          game_played_id?: number
          user_id?: string
          correct?: boolean
          question_data?: Json | null
          question_type?: number
          num_tries?: number | null
          created_at?: string
          id?: number
        }
      }
      games_played: {
        Row: {
          user_id: string
          created_at: string | null
          is_public: boolean
          id: number
        }
        Insert: {
          user_id: string
          created_at?: string | null
          is_public?: boolean
          id?: number
        }
        Update: {
          user_id?: string
          created_at?: string | null
          is_public?: boolean
          id?: number
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
        }
      }
      question_types: {
        Row: {
          name: string
          id: number
        }
        Insert: {
          name: string
          id?: never
        }
        Update: {
          name?: string
          id?: never
        }
      }
    }
    Views: {
      game_summaries: {
        Row: {
          n_correct: number | null
          n_questions: number | null
          game_id: number | null
          user_id: string | null
          created_at: string | null
          username: string | null
        }
      }
    }
    Functions: {
      submit_question: {
        Args: { user_id: string; is_public: boolean; answer_data: unknown }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

