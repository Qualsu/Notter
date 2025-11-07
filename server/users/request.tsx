import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { createUser, updateUser } from "./user";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useRequestUser() {
  const { user, isLoaded, isSignedIn } = useUser();

  const documentCount = useQuery(api.document.getDocumentCount, {
    userId: user ? user.id : "",
  });

  const documentPublicCount = useQuery(api.document.getPublicDocumentCount, {
    userId: user ? user.id : "",
  });

  const documentVerifiedCount = useQuery(api.document.getVerifiedDocumentCount, {
    userId: user ? user.id : "",
  });

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const createOrUpdateUser = async () => {
      const {
        id,
        firstName,
        lastName,
        username,
        imageUrl,
        createdAt,
        emailAddresses,
      } = user;

      if (!username) return;

        const createdUser = await createUser(
          id,
          username,
          createdAt,
          firstName,
          lastName,
          imageUrl || null,
          documentCount,
          documentPublicCount,
          documentVerifiedCount,
          emailAddresses[0].emailAddress
        );
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
            documentPublicCount,
            documentVerifiedCount,
            null,
            emailAddresses[0].emailAddress
          );
        }
    };

    createOrUpdateUser();
  }, [isLoaded, isSignedIn, user, documentCount, documentPublicCount]);

  return null;
}
