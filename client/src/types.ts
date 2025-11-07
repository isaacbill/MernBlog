export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Message {
  _id?: string;
  room: string;
  from: { userId: string; name: string };
  toUserId?: string | null;
  content: string;
  type: "text" | "file" | "system";
  fileMeta?: { url: string; originalName: string };
  ts: string | Date;
  readBy?: string[];
  reactions?: Record<string, string[]>;
}
