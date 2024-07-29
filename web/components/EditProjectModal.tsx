// components/EditProjectModal.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProjectRecord } from "@/type";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (editedProject: Partial<ProjectRecord>) => void;
  onBurn: () => void;
  project: ProjectRecord;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  onBurn,
  onSubmit,
  project,
}) => {
  const [editedProject, setEditedProject] = useState(project);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(editedProject);
    onClose();
  };

  const handleBurn = () => {
    onBurn();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="image_url" className="text-right">
              Image_Url
            </label>
            <Input
              id="image_url"
              name="image_url"
              value={editedProject.image_url}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="twitter" className="text-right">
              Twitter
            </label>
            <Input
              id="twitter"
              name="twitter"
              value={editedProject.x}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="telegram" className="text-right">
              Telegram
            </label>
            <Input
              id="telegram"
              name="telegram"
              value={editedProject.telegram}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="discord" className="text-right">
              Discord
            </label>
            <Input
              id="discord"
              name="discord"
              value={editedProject.discord}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="github" className="text-right">
              GitHub
            </label>
            <Input
              id="github"
              name="github"
              value={editedProject.github}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="description" className="text-right">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={editedProject.description}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          {/* Add more fields as needed */}
        </div>
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button type="submit" variant={"destructive"} onClick={handleBurn}>
              Burn
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              Save changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
