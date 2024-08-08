import React, { useState } from "react";
import Image from "next/image";
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
import ConfirmDialog from "./ConfirmDialog";
import ImageUploader from "@/components/imageUploader";

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

  const handleBurn = async () => {
    onBurn();
    onClose();
  };

  const handleImageUpload = (file: any) => {
    const url = file.cdnUrl;
    setEditedProject((prev) => ({ ...prev, image_url: url }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[800px] max-h-[90vh] overflow-y-auto"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <label htmlFor="image_url" className="block text-sm font-medium">
              Project Image
            </label>
            <div className="flex flex-col space-y-2">
              <ImageUploader onFileUploadSuccess={handleImageUpload} />
              <Input
                id="image_url"
                name="image_url"
                value={editedProject.image_url}
                onChange={handleChange}
                placeholder="Image URL"
              />
              {editedProject.image_url && (
                <div className="relative w-full h-[200px] bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={editedProject.image_url}
                    alt="Project"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="website" className="block text-sm font-medium">
                Website
              </label>
              <Input
                id="website"
                name="website"
                value={editedProject.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="x" className="block text-sm font-medium">
                Twitter
              </label>
              <Input
                id="x"
                name="x"
                value={editedProject.x}
                onChange={handleChange}
                placeholder="@username"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="telegram" className="block text-sm font-medium">
                Telegram
              </label>
              <Input
                id="telegram"
                name="telegram"
                value={editedProject.telegram}
                onChange={handleChange}
                placeholder="t.me/username"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="discord" className="block text-sm font-medium">
                Discord
              </label>
              <Input
                id="discord"
                name="discord"
                value={editedProject.discord}
                onChange={handleChange}
                placeholder="discord.gg/invite"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="github" className="block text-sm font-medium">
                GitHub
              </label>
              <Input
                id="github"
                name="github"
                value={editedProject.github}
                onChange={handleChange}
                placeholder="github.com/username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={editedProject.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your project..."
            />
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-between w-full">
            <ConfirmDialog
              triggerText="Burn Project"
              title="Burn Project"
              description="Are you sure you want to destroy this item? This action cannot be undone."
              onConfirm={handleBurn}
            />
            <Button type="submit" onClick={handleSubmit}>
              Save changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectModal;
