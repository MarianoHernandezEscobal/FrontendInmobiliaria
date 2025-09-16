"use server";

import { BASE_URL } from "@/constants/constants";
import axios from "axios";
import { AuthenticationResponseDto } from "./dto/authentication.response.dto";
import { UserUpdateRequestDto } from "./dto/user-update.request.dto";
import { ChangePasswordRequestDto } from "./dto/change-password.request.dto";
import { RegisterUser } from "@/types/user";

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthenticationResponseDto> => {
  const res = await axios.post<AuthenticationResponseDto>(
    `${BASE_URL}/user/login`,
    {
      user: { email, password },
    }
  );
  return res.data;
};

export const getUsers = async (token: string) => {
  const res = await axios.get(`${BASE_URL}/user/profile`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  return await res.data;
};

export const logoutUser = async () => {
  const res = await axios.post(BASE_URL + "/user/logout");
  return res.data;
};

export const updateUser = async (
  formData: UserUpdateRequestDto,
  token: string
): Promise<AuthenticationResponseDto> => {
  const res = await axios.put<AuthenticationResponseDto>(
    `${BASE_URL}/user/update`,
    { user: formData },
    {
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    }
  );
  return res.data;
};

export const changePassword = async (
  formData: ChangePasswordRequestDto,
  token: string
) => {
  const res = await axios.put(
    `${BASE_URL}/user/changePassword`,
    { ...formData },
    {
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    }
  );
  return res.data;
};

export const registerUser = async (
  user: RegisterUser
) => {
  const res = await axios.post<AuthenticationResponseDto>(
    `${BASE_URL}/user/create`,
    {
      user
    }
  );
  return res.data;
}
