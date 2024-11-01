import { Input } from "@/components/ui/input";
import React from "react";
import { FormLabel, FormControl, FormMessage, FormField } from "./form";
import { Control, FieldPath } from "react-hook-form";
import { authFormSchema } from "@/lib/utils";
import { z } from "zod";

const formSchema = authFormSchema('sign-up');

interface CustomInputProps {
  control: Control<z.infer<typeof formSchema>>;
  fieldLabel: string;
  fieldName: FieldPath<z.infer<typeof formSchema>>;
  fieldPlaceholder: string;
}

const CustomInput = ({
  control,
  fieldLabel,
  fieldName,
  fieldPlaceholder,
}: CustomInputProps) => {
  return (
    <div>
      <FormField
        control={control}
        name={fieldName}
        render={({ field }) => (
          <div className="form-item">
            <FormLabel className="form-label">{fieldLabel}</FormLabel>
            <div className="flex flex-col w-full gap-2">
              <FormControl>
                <Input id={fieldName} placeholder={fieldPlaceholder} type={ fieldName === 'password' ? 'password' : 'text'} {...field} />
              </FormControl>
              <FormMessage className="form-message" />
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default CustomInput;
