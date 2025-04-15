import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

// Объект с вариантами классов
const buttonVariants = {
  variants: {
    variant: {
      default: "bg-blue-500 text-white px-4 py-2 rounded",
      green: "bg-green-500 text-white px-4 py-2 rounded", // поправил цвет текста
      secondary: 'bg-gray-200 text-gray-800',
    },
    size: {
      default: "h-9 px-4 py-2 text-sm",
      sm: "h-8 rounded-md text-xs text-sm",
      lg: "h-10 rounded-md px-8 text-sm",
      icon: "h-9 w-9 text-sm",
    },
  },
  defaultVariants: {
    variant: "default",  // значение по умолчанию
  },
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "green"| 'secondary'; // Добавили типизацию для пропса variant
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", asChild = false, ...props }, ref) => {
    // Извлекаем правильный класс для variant
    const variantClass = buttonVariants.variants.variant[variant];

    // Выбираем компонент (Slot или button)
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(variantClass, className)} // Используем variantClass, чтобы применить соответствующий стиль
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
