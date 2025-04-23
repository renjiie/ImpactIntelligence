import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImpactArea } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { X, Check, Folder } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  assignee: z.string().min(1, "Please select an assignee"),
  dueDate: z.string().min(1, "Please select a due date"),
});

type FormValues = z.infer<typeof formSchema>;

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  documentId: number;
  impactArea?: ImpactArea;
}

const TaskDialog = ({ open, onClose, documentId, impactArea }: TaskDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: impactArea ? `Review impact on ${impactArea.name}` : "",
      description: impactArea?.conflict || impactArea?.recommendation || "",
      assignee: impactArea?.contact.email || "",
      dueDate: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/tasks", {
        ...values,
        documentId,
      });
      
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${documentId}/tasks`] });
      
      toast({
        title: "Task created",
        description: "Task has been created successfully and saved to Google Drive.",
        variant: "default",
      });
      
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error creating task",
        description: "An error occurred while creating the task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Create a new task from the document impact analysis
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter task description" 
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="assignee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {impactArea && (
                        <SelectItem value={impactArea.contact.email}>
                          {impactArea.contact.name} ({impactArea.contact.email})
                        </SelectItem>
                      )}
                      <SelectItem value="jane.smith@company.com">Jane Smith (jane.smith@company.com)</SelectItem>
                      <SelectItem value="michael.johnson@company.com">Michael Johnson (michael.johnson@company.com)</SelectItem>
                      <SelectItem value="sarah.lee@company.com">Sarah Lee (sarah.lee@company.com)</SelectItem>
                      <SelectItem value="me@example.com">Your Name (me)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel>Save To</FormLabel>
              <div className="flex items-center px-3 py-2 border border-input rounded-md">
                <Folder className="h-5 w-5 text-[var(--color-grey-500)] mr-2" />
                <span>Google Drive / Product Team / Tasks</span>
              </div>
            </div>
            
            <DialogFooter className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                <Check className="h-4 w-4 mr-1" />
                {isSubmitting ? "Creating..." : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
