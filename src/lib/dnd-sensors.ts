import { MouseSensor, useSensor, useSensors } from "@dnd-kit/core";

export const useDndSensors = () => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      // delay: 300,
      // tolerance: 5,
      distance: 50,
    },
  });
  const sensors = useSensors(mouseSensor);
  return sensors;
};
