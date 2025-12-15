// src/group/group.type.ts
export interface GroupMemberResponse {
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  joinedAt: Date;
}

export interface GroupResponse {
  id: string;
  name: string;
  description?: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  members: GroupMemberResponse[];
  settings: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}