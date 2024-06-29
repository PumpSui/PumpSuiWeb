// components/ProjectForm.tsx
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface ProjectFormData {
  name: string;
  totalDeposit: string;
  ratioToBuilders: string;
  minValue: string;
  maxValue: string;
  startTime: string;
  projectDuration: string;
  description: string;
  imageUrl: string;
  xLink: string;
  telegramLink: string;
  website: string;
  github: string;
}

const ProjectForm: React.FC = () => {
  const [form, setForm] = useState<ProjectFormData>({
    name: "",
    totalDeposit: "",
    ratioToBuilders: "",
    minValue: "",
    maxValue: "",
    startTime: "",
    projectDuration: "",
    description: "",
    imageUrl: "",
    xLink: "",
    telegramLink: "",
    website: "",
    github: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 提交表单处理逻辑
    console.log(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
      />

      <Input
        name="totalDeposit"
        value={form.totalDeposit}
        onChange={handleChange}
        placeholder="Total Deposit Value"
      />

      <Input
        name="ratioToBuilders"
        value={form.ratioToBuilders}
        onChange={handleChange}
        placeholder="Ratio to Builders (TDL * Ratio = CrowdFund for Builders)"
      />

      <div className="flex items-center">
        <Input
          name="minValue"
          value={form.minValue}
          onChange={handleChange}
          placeholder="min_value"
        />
        <span className="ml-2">SUI</span>
      </div>
      <div className="flex items-center">
        <Input
          name="maxValue"
          value={form.maxValue}
          onChange={handleChange}
          placeholder="max_value"
        />
        <span className="ml-2">SUI</span>
      </div>

      <div>
        <p>start time (for funding)</p>
        <div className="flex items-center space-x-4">
          <Button>Calendly</Button>
          <Button>Clock</Button>
        </div>
      </div>

      <Input
        name="projectDuration"
        value={form.projectDuration}
        onChange={handleChange}
        placeholder="Project Development Time (days)"
      />

      <Textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        rows={3}
      />

      <Input
        name="imageUrl"
        value={form.imageUrl}
        onChange={handleChange}
        placeholder="Image_url (Optional)"
      />

      <Input
        name="xLink"
        value={form.xLink}
        onChange={handleChange}
        placeholder="x link (Optional)"
      />

      <Input
        name="telegramLink"
        value={form.telegramLink}
        onChange={handleChange}
        placeholder="telegram link (Optional)"
      />

      <Input
        name="website"
        value={form.website}
        onChange={handleChange}
        placeholder="website (Optional)"
      />

      <Input
        name="github"
        value={form.github}
        onChange={handleChange}
        placeholder="Github (Optional)"
      />

      <Button type="submit">Create Project</Button>

      <p>deploy fee: (max(20, TDL * Ratio * 1%))</p>
    </form>
  );
};

export default ProjectForm;
