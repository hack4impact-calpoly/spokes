import { Box, useRadio } from "@chakra-ui/react";

interface RadioCardProps {
  children: React.ReactNode;
  value: string;
}

const RadioCard = (props: RadioCardProps) => {
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderRadius="md"
        textAlign="center"
        px={5}
        py={3}
        bg="#F6F6F6"
        _checked={{
          bg: "#BFBFBF",
          color: "black",
          borderColor: "F6F6F6",
        }}
        _hover={{
          bg: "#BFBFBF",
          color: "black",
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
};

export default RadioCard;
