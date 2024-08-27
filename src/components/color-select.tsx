import Circle from "@uiw/react-color-circle";

type ColorSelectPropType = {
  value: string | undefined;
  setValue: (value: string) => void;
  colors: string[];
};

const ColorSelect = ({ value, setValue, colors }: ColorSelectPropType) => {
  return (
    <div className="flex items-center gap-4">
      <Circle
        colors={colors}
        pointProps={{ style: { width: "20px", height: "20px" } }}
        onChange={(color) => setValue(color.hex)}
        color={value}
      />
      {/* <Popover>
        <PopoverTrigger asChild>
          <div
            className={cn(
              colorClassMap[value ?? "#f44336"],
              "size-6 cursor-pointer rounded-lg",
            )}
          ></div>
        </PopoverTrigger>
        <PopoverContent side="left" className="w-fit">
        </PopoverContent>
      </Popover> */}
    </div>
  );
};
export default ColorSelect;
