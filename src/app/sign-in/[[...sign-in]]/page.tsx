import { SignIn } from "@clerk/nextjs";
import { Center } from "@chakra-ui/react";

export default function Page() {
  return (
    <Center height="100vh">
      <SignIn />
    </Center>
  );
}
