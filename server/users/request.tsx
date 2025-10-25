import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { createUser, updateUser } from "./user";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useRequestUser() {
  const { user, isLoaded, isSignedIn } = useUser();

  const documentCount = useQuery(api.document.getDocumentCount, {
    userId: user?.id as string
  })
  const documentPublicCount = useQuery(api.document.getPublicDocumentCount, {
    userId: user?.id as string
  })

  useEffect(() => {
    const createOrUpdateUser = async () => {
      if (isLoaded && isSignedIn && user) {
        const { id, firstName, lastName, username, imageUrl, createdAt } = user;

        if (username === null) return;

        try {
          const createdUser = await createUser(
            id,
            username,
            createdAt,
            firstName,
            lastName,
            imageUrl || null,
            documentCount,
            documentPublicCount
          );

          console.log("Создан пользователь:", createdUser);

          if (!createdUser) {
            const updatedUser = await updateUser(
              id,
              username,
              firstName,
              lastName,
              imageUrl || null,
              null,
              null,
              documentCount,
              documentPublicCount
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

  return null;
}
