import React from "react";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";
import { User, ShieldCheck } from "phosphor-react";
import { motion } from "framer-motion";

interface AuthToggleProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const AuthToggle: React.FC<AuthToggleProps> = ({
  selectedRole,
  onRoleChange,
}) => {
  return (
    <div className="flex items-center bg-secondary rounded-lg p-1 relative">
      <motion.div
        className="absolute bg-white rounded-md shadow-md h-8"
        layoutId="auth-toggle"
        initial={false}
        animate={{
          x: selectedRole === UserRole.USER ? 0 : "100%",
          width: selectedRole === UserRole.USER ? 120 : 100,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRoleChange(UserRole.USER)}
        className={`relative z-10 h-8 px-4 ${
          selectedRole === UserRole.USER
            ? "text-foreground font-medium"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <User size={16} className="mr-2" />
        Customer
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRoleChange(UserRole.ADMIN)}
        className={`relative z-10 h-8 px-4 ${
          selectedRole === UserRole.ADMIN
            ? "text-foreground font-medium"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <ShieldCheck size={16} className="mr-2" />
        Admin
      </Button>
    </div>
  );
};
