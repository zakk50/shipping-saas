import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export function Dialog({ open, onOpenChange, children }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

export function DialogTrigger({ children }) {
  return (
    <DialogPrimitive.Trigger asChild>
      {children}
    </DialogPrimitive.Trigger>
  );
}

export function DialogContent({ children }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
      <DialogPrimitive.Content
        className="fixed top-[50%] left-[50%] w-[90%] max-w-lg bg-white rounded-md shadow-lg transform -translate-x-[50%] -translate-y-[50%] p-6 focus:outline-none"
      >
        {children}
        <DialogPrimitive.Close className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return (
    <DialogPrimitive.Title className="text-lg font-semibold">
      {children}
    </DialogPrimitive.Title>
  );
}

export function DialogDescription({ children }) {
  return (
    <DialogPrimitive.Description className="text-sm text-gray-500 mb-4">
      {children}
    </DialogPrimitive.Description>
  );
}
