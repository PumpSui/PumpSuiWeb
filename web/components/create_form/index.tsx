// components/ProjectForm.tsx
import React, { useState } from "react";
import { Button } from "../ui/button";
import DatePicker from "react-datepicker";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import "react-datepicker/dist/react-datepicker.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

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

  const [startDate, setStartDate] = useState<Date | null>(null);

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
          placeholder="Min_value"
        />
        <span className="text-cyan-400 ml-2">SUI</span>
      </div>
      <div className="flex items-center">
        <Input
          name="maxValue"
          value={form.maxValue}
          onChange={handleChange}
          placeholder="Max_value"
        />
        <span className="text-cyan-400 ml-2">SUI</span>
      </div>

      <div>
        <span className="mr-2">Project Start Time:</span>
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => setStartDate(date)}
          showTimeSelect
          dateFormat="Pp"
          className="min-full bg-primary-foreground border rounded px-3 py-2"
        />
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
      <Accordion type="single" collapsible>
        <AccordionItem value="Optional">
          <AccordionTrigger>Some more options ?</AccordionTrigger>
          <AccordionContent>
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
              placeholder="X Link (Optional)"
            />
            <Input
              name="telegramLink"
              value={form.telegramLink}
              onChange={handleChange}
              placeholder="Telegram link (Optional)"
            />
            <Input
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="Website (Optional)"
            />
            <Input
              name="github"
              value={form.github}
              onChange={handleChange}
              placeholder="Github (Optional)"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="min-w-full" type="submit">
        Create Project
      </Button>

      <p className="text-cyan-400">Deploy Fee: (max(20, TDL * Ratio * 1%))</p>
    </form>
  );
};

export default ProjectForm;
