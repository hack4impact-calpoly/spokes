import React, { useLayoutEffect, useCallback, useEffect, useState, useMemo, useRef } from "react";

import { useMediaQuery, useTheme, Progress, VStack, Button, Flex, Box } from "@chakra-ui/react";

import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import useBoundingRect from "./hooks/useBoundingRect";
import percentage from "./utils/percentage";

const MotionFlex = motion.create(Flex);

const transitionProps = {
  stiffness: 400,
  type: "spring",
  damping: 60,
  mass: 3,
};

const ChakraCarousel = ({ children, gap, onScrollStateChange }) => {
  const [trackIsActive, setTrackIsActive] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [multiplier, setMultiplier] = useState(0.35);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [activeItem, setActiveItem] = useState(0);
  const [constraint, setConstraint] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);

  const initSliderWidth = useCallback((width) => setSliderWidth(width), []);

  // Calculate positions for each child based on item width and gap
  const positions = useMemo(
    () => children.map((_, index) => -Math.abs((itemWidth + gap) * index)),
    [children, itemWidth, gap],
  );

  const { breakpoints } = useTheme();
  // Define mobile as any viewport smaller than the md breakpoint.
  const [isMobile] = useMediaQuery(`(max-width: ${breakpoints.md})`);

  useEffect(() => {
    if (isMobile) {
      // Mobile: show 1 job with padding on sides when not scrolled or at first item
      setItemWidth(sliderWidth - gap);
      setMultiplier(0.65);
      setConstraint(1);
    } else {
      // Web: show 2 jobs side-by-side with padding when not scrolled or at first item
      setItemWidth(sliderWidth / 2 - gap);
      setMultiplier(0.5);
      setConstraint(2);
    }
  }, [isMobile, sliderWidth, gap]);

  // hasScrolled state based on activeItem
  useEffect(() => {
    // if we get at the first item, reset the hasScrolled state
    if (activeItem === 0) {
      setHasScrolled(false);
    }
  }, [activeItem, setHasScrolled]);

  // notify parent component of scroll state changes
  useEffect(() => {
    if (onScrollStateChange) {
      onScrollStateChange(hasScrolled);
    }
  }, [hasScrolled, onScrollStateChange]);

  const sliderProps = {
    setTrackIsActive,
    initSliderWidth,
    setActiveItem,
    activeItem,
    constraint,
    itemWidth,
    positions,
    gap,
    hasScrolled,
    setHasScrolled,
  };

  const trackProps = {
    setTrackIsActive,
    trackIsActive,
    setActiveItem,
    sliderWidth,
    activeItem,
    constraint,
    multiplier,
    itemWidth,
    positions,
    gap,
    hasScrolled,
    setHasScrolled,
  };

  const itemProps = {
    setTrackIsActive,
    trackIsActive,
    setActiveItem,
    activeItem,
    constraint,
    itemWidth,
    positions,
    gap,
  };

  return (
    <Slider {...sliderProps}>
      <Track {...trackProps}>
        {children.map((child, index) => (
          <Item {...itemProps} index={index} key={index}>
            {child}
          </Item>
        ))}
      </Track>
    </Slider>
  );
};

const Slider = ({
  setTrackIsActive,
  initSliderWidth,
  setActiveItem,
  activeItem,
  constraint,
  itemWidth,
  positions,
  children,
  gap,
  hasScrolled,
  setHasScrolled,
}) => {
  const [ref, { width }] = useBoundingRect();

  useLayoutEffect(() => initSliderWidth(Math.round(width)), [width, initSliderWidth]);

  const handleFocus = () => setTrackIsActive(true);

  const handleDecrementClick = () => {
    setTrackIsActive(true);

    if (activeItem !== 0) {
      setActiveItem((prev) => {
        // if we're going to the first item, reset hasScrolled
        if (prev === 1) {
          setHasScrolled(false);
        } else {
          setHasScrolled(true);
        }
        return prev - 1;
      });
    }
  };

  const handleIncrementClick = () => {
    setTrackIsActive(true);
    setHasScrolled(true);
    if (activeItem !== positions.length - constraint) {
      setActiveItem((prev) => prev + 1);
    }
  };

  // padding calculated based on scroll state
  const sidePadding = activeItem === 0 ? gap * 2 : 0;

  return (
    <>
      <Box
        ref={ref}
        w={{ base: "100%", md: hasScrolled ? "100vw" : `calc(100% + ${gap}px)` }}
        ml={{ base: 0, md: hasScrolled ? "calc(-50vw + 50%)" : `-${gap / 2}px` }}
        position="relative"
        overflow="hidden"
        sx={{
          padding: `0 ${sidePadding}pr`,
          transition:
            "padding 0.7s cubic-bezier(0.4, 0, 0.2, 1), margin 0.7s cubic-bezier(0.4, 0, 0.2, 1), width 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        _before={{
          bgGradient: "linear(to-r, base.d400, transparent)",
          position: "absolute",
          w: `${gap / 2}px`,
          content: "''",
          zIndex: 1,
          h: "100%",
          left: 0,
          top: 0,
          opacity: hasScrolled ? 0.8 : 0.3,
          transition: "opacity 0.7s ease-out",
        }}
        _after={{
          bgGradient: "linear(to-l, base.d400, transparent)",
          position: "absolute",
          w: `${gap / 2}px`,
          content: "''",
          zIndex: 1,
          h: "100%",
          right: 0,
          top: 0,
          opacity: hasScrolled ? 0.8 : 0.3,
          transition: "opacity 0.7s ease-out",
        }}
      >
        {children}
      </Box>

      <Flex w={`${itemWidth}px`} mt={`${gap / 2}px`} mx="auto">
        <Button
          onClick={handleDecrementClick}
          onFocus={handleFocus}
          mr={`${gap / 3}px`}
          variant="link"
          minW={0}
          _active={{
            svg: {
              fill: "none",
              stroke: "black",
            },
          }}
        >
          <ChevronLeftIcon boxSize={9} color="black" />
        </Button>

        <Progress
          value={percentage(activeItem, positions.length - constraint)}
          alignSelf="center"
          borderRadius="2px"
          bg="gray.200"
          flex={1}
          h="3px"
          sx={{
            "> div": {
              backgroundColor: "black",
              transition: "width 0.4s linear",
            },
          }}
        />

        <Button
          onClick={handleIncrementClick}
          onFocus={handleFocus}
          ml={`${gap / 3}px`}
          variant="link"
          zIndex={2}
          minW={0}
          _active={{
            svg: {
              fill: "none",
              stroke: "black",
            },
          }}
        >
          <ChevronRightIcon boxSize={9} color="black" />
        </Button>
      </Flex>
    </>
  );
};

const Track = ({
  setTrackIsActive,
  trackIsActive,
  setActiveItem,
  activeItem,
  constraint,
  multiplier,
  itemWidth,
  positions,
  children,
  setHasScrolled,
}) => {
  const [dragStartPosition, setDragStartPosition] = useState(0);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const node = useRef(null);

  const handleDragStart = () => {
    setDragStartPosition(positions[activeItem]);
    setHasScrolled(true);
  };

  const handleDragEnd = (_, info) => {
    const distance = info.offset.x;
    const velocity = info.velocity.x * multiplier;
    const direction = velocity < 0 || distance < 0 ? 1 : -1;

    const extrapolatedPosition =
      dragStartPosition + (direction === 1 ? Math.min(velocity, distance) : Math.max(velocity, distance));

    const closestPosition = positions.reduce(
      (prev, curr) => (Math.abs(curr - extrapolatedPosition) < Math.abs(prev - extrapolatedPosition) ? curr : prev),
      0,
    );

    if (!(closestPosition < positions[positions.length - constraint])) {
      setActiveItem(positions.indexOf(closestPosition));
      controls.start({
        x: closestPosition,
        transition: { velocity: info.velocity.x, ...transitionProps },
      });
    } else {
      setActiveItem(positions.length - constraint);
      controls.start({
        x: positions[positions.length - constraint],
        transition: { velocity: info.velocity.x, ...transitionProps },
      });
    }

    if (positions.indexOf(closestPosition) === 0) {
      setHasScrolled(false);
    }
  };

  const handleResize = useCallback(
    () =>
      controls.start({
        x: positions[activeItem],
        transition: { ...transitionProps },
      }),
    [activeItem, controls, positions],
  );

  const handleClick = useCallback(
    (event) => (node.current.contains(event.target) ? setTrackIsActive(true) : setTrackIsActive(false)),
    [setTrackIsActive],
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (trackIsActive) {
        if (activeItem < positions.length - constraint) {
          if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            event.preventDefault();
            setActiveItem((prev) => prev + 1);
            setHasScrolled(true);
          }
        }
        if (activeItem > 0) {
          if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            event.preventDefault();
            setActiveItem((prev) => prev - 1);
            setHasScrolled(true);
          }
        }
      }
    },
    [trackIsActive, setActiveItem, activeItem, constraint, positions.length, setHasScrolled],
  );

  useEffect(() => {
    handleResize();
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [handleClick, handleResize, handleKeyDown, positions]);

  return (
    <>
      {itemWidth && (
        <VStack ref={node} spacing={5} alignItems="stretch">
          <MotionFlex
            dragConstraints={node}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            animate={controls}
            style={{ x }}
            drag="x"
            _active={{ cursor: "grabbing" }}
            minWidth="min-content"
            flexWrap="nowrap"
            cursor="grab"
          >
            {children}
          </MotionFlex>
        </VStack>
      )}
    </>
  );
};

const Item = ({
  setTrackIsActive,
  setActiveItem,
  activeItem,
  constraint,
  itemWidth,
  positions,
  children,
  index,
  gap,
}) => {
  const [userDidTab, setUserDidTab] = useState(false);

  const handleFocus = () => setTrackIsActive(true);

  const handleBlur = () => {
    if (userDidTab && index + 1 === positions.length) {
      setTrackIsActive(false);
    }
    setUserDidTab(false);
  };

  const handleKeyUp = (event) => {
    if (event.key === "Tab" && activeItem !== positions.length - constraint) {
      setActiveItem(index);
    }
  };

  const handleKeyDown = (event) => event.key === "Tab" && setUserDidTab(true);

  return (
    <Flex
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyUp={handleKeyUp}
      onKeyDown={handleKeyDown}
      w={`${itemWidth}px`}
      _notLast={{ mr: `${gap}px` }}
      py="4px"
    >
      {children}
    </Flex>
  );
};

export default ChakraCarousel;
