import { SignUp } from "@clerk/nextjs";
import { Center } from "@chakra-ui/react";

export default function Page() {
  return (
    <Center height="100vh">
      <SignUp />
    </Center>
  );
}
