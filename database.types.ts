export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      chat_message: {
        Row: {
          chat: string;
          created_at: string;
          id: number;
          message: string;
          user: string;
        };
        Insert: {
          chat: string;
          created_at?: string;
          id?: number;
          message: string;
          user?: string;
        };
        Update: {
          chat?: string;
          created_at?: string;
          id?: number;
          message?: string;
          user?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_message_chat_fkey";
            columns: ["chat"];
            isOneToOne: false;
            referencedRelation: "chats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_message_user_fkey";
            columns: ["user"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      chat_participants: {
        Row: {
          chat: string;
          created_at: string;
          id: string;
          user: string | null;
        };
        Insert: {
          chat: string;
          created_at?: string;
          id?: string;
          user?: string | null;
        };
        Update: {
          chat?: string;
          created_at?: string;
          id?: string;
          user?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chat_participants_chat_fkey";
            columns: ["chat"];
            isOneToOne: false;
            referencedRelation: "chats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_participants_user_fkey";
            columns: ["user"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      chats: {
        Row: {
          created_at: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
        };
        Relationships: [];
      };
      friend_reqs: {
        Row: {
          created_at: string;
          id: string;
          isAccepted: boolean | null;
          user_1: string;
          user_2: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          isAccepted?: boolean | null;
          user_1?: string;
          user_2: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          isAccepted?: boolean | null;
          user_1?: string;
          user_2?: string;
        };
        Relationships: [
          {
            foreignKeyName: "friend_reqs_user_1_fkey";
            columns: ["user_1"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "friend_reqs_user_2_fkey";
            columns: ["user_2"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      posts: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          privacy: string | null;
          user: string;
          posts_likes?: {
            created_at: string;
            id: string;
            post: string;
            user: string;
            users?: {
              created_at: string;
              fullname: string;
              id: string;
              username: string;
            };
          }[];
          users?: {
            created_at: string;
            fullname: string;
            id: string;
            username: string;
          };
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          privacy?: string | null;
          user?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          privacy?: string | null;
          user?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_user_fkey";
            columns: ["user"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      posts_likes: {
        Row: {
          created_at: string;
          id: string;
          post: string;
          user: string;
          users?: {
            created_at: string;
            fullname: string;
            id: string;
            username: string;
          };
        };
        Insert: {
          created_at?: string;
          id?: string;
          post: string;
          user?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          post?: string;
          user?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_likes_post_fkey";
            columns: ["post"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "posts_likes_user_fkey";
            columns: ["user"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          created_at: string;
          fullname: string;
          id: string;
          username: string;
        };
        Insert: {
          created_at?: string;
          fullname: string;
          id?: string;
          username: string;
        };
        Update: {
          created_at?: string;
          fullname?: string;
          id?: string;
          username?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
