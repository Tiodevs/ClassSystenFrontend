"use server";

import { cookies } from "next/headers";
import { api } from "../services/api";

export async function handleRegister(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    throw new Error("Preencha todos os campos");
  }

  try {
    const response = await api.post("/login", {
      email,
      password,
    });

    if (!response.data.token) {
      throw new Error("Erro ao obter o token");
    }

    const expressTime = 60 * 60 * 24 * 30 * 1000;

    cookies().set("session", response.data.token, {
      maxAge: expressTime,
      httpOnly: false,
    });
  } catch (err: any) {
    console.log("Erro ::::",err.data)
    throw new Error(err.message);
  }
}
