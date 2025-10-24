import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { createUser, updateUser } from "./user";

export function useRequestUser(){
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    const createOrUpdateUser = async () => {
      if (isLoaded && isSignedIn && user) {
        const { id, firstName, lastName, username, imageUrl, createdAt } = user;

        if (username === null) return

        try {
          // Пробуем создать пользователя
          const createdUser = await createUser(
            id,
            username,
            createdAt,
            firstName,
            lastName,
            imageUrl || null
          );

          console.log("Создан пользователь:", createdUser);

          // Если создание не удалось (400 ошибка), пробуем обновить пользователя
          if (!createdUser) {
            const updatedUser = await updateUser(
              id,
              username,
              firstName,
              lastName,
              imageUrl || null
            );

            console.log("Обновлен пользователь:", updatedUser);

            if (!updatedUser) {
              console.error("Не удалось создать или обновить пользователя.");
            }
          }
        } catch (error) {
          console.error("Произошла ошибка при создании или обновлении пользователя:", error);
        }
      }
    };

    createOrUpdateUser();
  }, [isLoaded, isSignedIn, user]);

  return null; // Не рендерим ничего, только выполняем запросы
};