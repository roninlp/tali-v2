import { colorClassMap } from "@/data/project-colors";
import { cn } from "@/lib/utils";
import Circle from "@uiw/react-color-circle";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type ColorSelectPropType = {
  value: string | undefined;
  setValue: (value: string) => void;
  colors: string[];
};

const ColorSelect = ({ value, setValue, colors }: ColorSelectPropType) => {
  return (
    <div className="flex items-center gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={cn(
              colorClassMap[value ?? "#f44336"],
              "size-6 cursor-pointer rounded-lg",
            )}
          ></div>
        </PopoverTrigger>
        <PopoverContent side="left" className="w-fit">
          <Circle
            colors={colors}
            pointProps={{ style: { width: "20px", height: "20px" } }}
            onChange={(color) => setValue(color.hex)}
            color={value}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
export default ColorSelect;
