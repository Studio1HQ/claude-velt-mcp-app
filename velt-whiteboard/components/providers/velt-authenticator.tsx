"use client";

import {
  useVeltClient,
  VeltPresence,
  VeltComments,
  VeltCommentsSidebar,
  VeltCursor,
} from "@veltdev/react";
import { useWhiteboardStore } from "@/lib/store/whiteboard-store";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function VeltAuthenticator({ children }: { children: React.ReactNode }) {
  const { client } = useVeltClient();
  const { currentUser, documentId } = useWhiteboardStore();
  const [isUserIdentified, setIsUserIdentified] = useState(false);
  const { theme } = useTheme();

  // Identify user when client or currentUser changes
  useEffect(() => {
    const identifyUser = async () => {
      if (client && currentUser) {
        try {
          console.log(
            "🔐 Identifying user:",
            currentUser.name,
            currentUser.userId,
          );

          await client.identify({
            userId: currentUser.userId,
            name: currentUser.name,
            email: currentUser.email,
            photoUrl: currentUser.photoUrl,
            organizationId: currentUser.organizationId,
          });

          setIsUserIdentified(true);
          console.log("✅ User identified successfully:", currentUser.name);
          await client.setDarkMode(theme === "dark");
          const commentElement = client.getCommentElement();
          commentElement.allowedElementIds(['canvas-area']);
        } catch (error) {
          console.error("❌ Error identifying user:", error);
          setIsUserIdentified(false);
        }
      }
    };

    identifyUser();
  }, [client, currentUser, theme]);

  // Set document after user is identified
  useEffect(() => {
    if (client && documentId && isUserIdentified) {
      console.log("📄 Setting document:", documentId);
      client.setDocument(documentId);
      console.log("✅ Document set successfully");
    }
  }, [client, documentId, isUserIdentified]);

  return (
    <>
      {/* <VeltPresence /> */}
      <VeltComments shadowDom={false} />
      <VeltCommentsSidebar shadowDom={false} />
      <VeltCursor />
      {children}
    </>
  );
}
