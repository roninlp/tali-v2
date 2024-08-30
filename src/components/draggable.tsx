import { useDraggable } from "@dnd-kit/core";
import { ElementType, ReactElement, ReactNode } from "react";

type DraggableProps = {
  id: number;
  element?: ElementType;
  children: ReactNode;
};

export function Draggable(props: DraggableProps) {
  const Element = props.element || "div";
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: props.id,
  });

  return (
    <Element ref={setNodeRef} {...listeners} {...attributes}>
      {props.children}
    </Element>
  );
}
