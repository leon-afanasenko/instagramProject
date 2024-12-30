import { $api } from "../api";

export const getUserByIdApi = async (userId: string) => {
  try {
    const { data } = await $api.get(`/user/${userId}`);
    return data;
  } catch (e) {
    console.error(e);
    throw new Error("Ошибка при получении пользователя");
  }
};
