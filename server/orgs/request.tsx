import { useEffect } from "react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { createOrg, updateOrg, getById } from "./org";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useRequestOrg() {
  const { organization, isLoaded } = useOrganization();
  const { isSignedIn } = useUser();
  const orgId = organization?.id;

  const documentCount = useQuery(api.document.getDocumentCount, {
    userId: orgId ? orgId : "",
  });
  const documentPublicCount = useQuery(api.document.getPublicDocumentCount, {
    userId: orgId ? orgId : "",
  });

  const documentVerifiedCount = useQuery(api.document.getVerifiedDocumentCount, {
    userId: orgId ? orgId : "",
  });

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !organization) return;
    const createOrUpdateOrg = async () => {
      const { id, name, createdAt, imageUrl, slug } = organization;
      let adminId = null;
      const membersList: string[] = [];

      try {
        const memberships = await organization.getMemberships();

        memberships.data.forEach((member) => {
          if (member.role === "org:admin") {
            adminId = member.publicUserData.userId;
          }
          membersList.push(member.publicUserData.userId as string);
        });

        if (id === undefined) return null;

        const existingOrg = await getById(id);
        if (!existingOrg) {
          const createdOrg = await createOrg(
            id,
            slug,
            adminId,
            createdAt,
            name,
            membersList,
            imageUrl || null,
            documentCount,
            documentPublicCount,
            documentVerifiedCount
          );

          console.log("Создана организация:", createdOrg);
        } else {
          const updatedOrg = await updateOrg(
            id,
            slug,
            adminId,
            name,
            imageUrl || null,
            null,
            null,
            documentCount,
            documentPublicCount,
            membersList,
            null,
            null,
            documentVerifiedCount
          );

          console.log("Обновлена организация:", updatedOrg);
        }
      } catch (error) {
        console.error("Произошла ошибка при создании или обновлении организации:", error);
      }
    };

    createOrUpdateOrg();
  }, [isLoaded, isSignedIn, organization, orgId]);

  return null;
}