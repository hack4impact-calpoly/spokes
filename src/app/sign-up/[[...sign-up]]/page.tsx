import { SignUp } from "@clerk/nextjs";
import { Center } from "@chakra-ui/react";

export default function Page() {
  return (
    <Center minHeight="100vh" px={{ base: 4, md: 0 }}>
      <SignUp />
    </Center>
  );
}
