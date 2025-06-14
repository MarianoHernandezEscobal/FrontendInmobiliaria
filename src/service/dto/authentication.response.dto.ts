import { User } from "@/types/user";

export interface AuthenticationResponseDto {
    user: User;
    token: string;
}