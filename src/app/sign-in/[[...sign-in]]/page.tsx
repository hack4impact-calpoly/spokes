import { SignIn } from "@clerk/nextjs";
import { Center } from "@chakra-ui/react";

export default function Page() {
  return (
    <Center minHeight="100vh" px={{ base: 4, md: 0 }}>
      <SignIn
        appearance={{
          layout: {
            showOptionalFields: false, //hide phone number field if not using
          },
        }}
      />
    </Center>
  );
}
