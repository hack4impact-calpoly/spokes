import { SignUp } from "@clerk/nextjs";
import { Center } from "@chakra-ui/react";

export default function Page() {
  return (
    <Center className="mt-10 mb-10" px={{ base: 4, md: 0 }}>
      <SignUp />
    </Center>
  );
}
