import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input, InputProps } from "@heroui/react";

interface ControlledInputProps<T extends FieldValues> extends Omit<
  InputProps,
  "name"
> {
  name: Path<T>;
  control: Control<T>;
}

export const ControlledInput = <T extends FieldValues>({
  name,
  control,
  ...props
}: ControlledInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { onChange, onBlur, value, name: fieldName, ref } = field;
        return (
          <Input
            {...(props as any)}
            name={fieldName}
            value={value ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            ref={ref}
            isInvalid={!!error}
            errorMessage={error?.message}
          />
        );
      }}
    />
  );
};
