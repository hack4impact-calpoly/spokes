import { SignIn } from "@clerk/nextjs";
import { Center } from "@chakra-ui/react";

export default function Page() {
  return (
    <Center height={"54vh"} px={{ base: 4, md: 0 }}>
      <SignIn />
    </Center>
  );
}
