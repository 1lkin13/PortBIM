import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  User,
  Spinner,
} from "@heroui/react";
import { Edit2, Trash2, Search } from "lucide-react";
import { Designer } from "../../../core/domain/models/Designer";

interface DesignersTableProps {
  designers: Designer[];
  isLoading: boolean;
  onEdit: (designer: Designer) => void;
  onDelete: (designer: Designer) => void;
}

export const DesignersTable: React.FC<DesignersTableProps> = ({
  designers,
  isLoading,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full overflow-x-auto border-divider touch-auto pb-2">
      <Table
        aria-label="Designers table"
        shadow="none"
        removeWrapper
        isHeaderSticky
        className="min-w-max"
        classNames={{
          base: "max-h-[70vh] overflow-y-auto scrollbar-hide",
          th: "bg-gray-50/50 text-text-secondary font-bold text-[10px] uppercase tracking-wider h-14 border-b border-gray-100 text-center first:text-left whitespace-nowrap px-6",
          td: "py-4 border-b border-gray-50/50 group-last:border-none text-center first:text-left whitespace-nowrap px-6",
        }}
      >
        <TableHeader>
          <TableColumn className="w-[30%]">FULL NAME</TableColumn>
          <TableColumn>WORKING HOURS</TableColumn>
          <TableColumn>ATTACHED OBJECTS</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          emptyContent={
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="p-4 bg-gray-50 rounded-full">
                <Search className="text-gray-300" size={40} />
              </div>
              <p className="text-text-secondary font-medium">
                No designers found
              </p>
            </div>
          }
          items={designers}
          loadingContent={<Spinner color="primary" />}
        >
          {(designer) => (
            <TableRow
              key={designer.id}
              className="group hover:bg-gray-50/50 transition-colors"
            >
              <TableCell>
                <User
                  avatarProps={{
                    radius: "lg",
                    size: "sm",
                    src:
                      designer.avatarUrl ||
                      `https://i.pravatar.cc/150?u=${designer.id}`,
                    className: "shadow-sm border-2 border-white",
                  }}
                  description={
                    designer.fullName.toLowerCase().replace(" ", ".") +
                    "@portbim.com"
                  }
                  name={designer.fullName}
                  classNames={{
                    name: "text-sm font-bold text-text-primary",
                    description: "text-[10px] text-text-secondary",
                  }}
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-semibold text-text-primary">
                    {designer.workingHours}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  className="capitalize border-none bg-primary/10 text-primary font-bold"
                  size="sm"
                  variant="flat"
                >
                  {designer.attachedObjectsCount} Objects
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <Chip
                    className="capitalize border-none font-bold"
                    color={designer.status === "active" ? "success" : "danger"}
                    size="sm"
                    variant="flat"
                  >
                    {designer.status}
                  </Chip>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => onEdit(designer)}
                    className="text-text-secondary hover:text-primary min-w-8 w-8 h-8 rounded-lg"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => onDelete(designer)}
                    className="min-w-8 w-8 h-8 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
