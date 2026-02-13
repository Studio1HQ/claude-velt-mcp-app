import React, { useEffect, useState } from "react";
import {
  VeltProvider as VeltReactProvider,
  VeltComments,
  VeltPresence,
  VeltCursor,
} from "@veltdev/react";
import { useVeltClient } from "@veltdev/react";

// Static users for demonstration
const DEMO_USERS = [
  {
    userId: "user-alice",
    organizationId: "canvas-org",
    name: "Alice Johnson",
    email: "alice@example.com",
    photoUrl: "https://i.pravatar.cc/150?img=1",
  },
  {
    userId: "user-bob",
    organizationId: "canvas-org",
    name: "Bob Smith",
    email: "bob@example.com",
    photoUrl: "https://i.pravatar.cc/150?img=2",
  },
];

// Randomly select a user (for demo purposes)
const getRandomUser = () => {
  return DEMO_USERS[Math.floor(Math.random() * DEMO_USERS.length)];
};

interface VeltProviderWrapperProps {
  children: React.ReactNode;
  documentId: string;
}

const VeltDocumentSetup: React.FC<{ documentId: string }> = ({
  documentId,
}) => {
  const { client } = useVeltClient();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeVelt = async () => {
      // Wait for client to be available
      if (!client) {
        console.log("Waiting for Velt client to initialize...");
        return;
      }

      if (isInitialized) {
        console.log("Velt already initialized");
        return;
      }

      try {
        console.log("Initializing Velt...");

        // Select a demo user
        const user = getRandomUser();
        console.log("Identifying user:", user.name);

        // Identify the user
        await client.identify(user);
        console.log("User identified successfully");

        // Set the document
        client.setDocument(documentId, {
          documentName: "Collaborative Canvas Board",
        });
        console.log("Document set:", documentId);

        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize Velt:", error);
      }
    };

    initializeVelt();
  }, [client, documentId]); // Removed isInitialized from dependencies - let the internal check handle it

  return null;
};

export const VeltProviderWrapper: React.FC<VeltProviderWrapperProps> = ({
  children,
  documentId,
}) => {
  return (
    <VeltReactProvider apiKey="">
      <VeltDocumentSetup documentId={documentId} />

      {/* Velt Collaboration Features */}
      <VeltPresence />
      <VeltCursor />
      <VeltComments />

      {children}
    </VeltReactProvider>
  );
};
