import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EnhancedSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  className?: string;
}

export default function EnhancedSelect({
  value,
  onValueChange,
  placeholder = "Select an option",
  options,
  className = "",
}: EnhancedSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={`bg-white/10 border-white/30 text-white placeholder:text-white/70 ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
