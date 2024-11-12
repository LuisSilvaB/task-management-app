import { TaskResolver } from "@/app/schema/task.schema";
import { TaskType } from "@/app/types/taks.type";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import useToggle from "@/hooks/useToggle.hook"
import { MdDelete } from "react-icons/md";

import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { deleteTask } from "@/app/features/task.feature";
import { toast } from "@/hooks/use-toast";

type TaksManagementBodyDialogProps = {
  task: TaskType;
}

const TaksManagementBodyDeleteDialog = ({ task } :TaksManagementBodyDialogProps) => {
  const toggle = useToggle(false)
  const dispatch = useDispatch<AppDispatch>()

  const onDeleteTask = async (id: number) => {
    const dataDeleted = dispatch(deleteTask(id));
    if ((await dataDeleted).payload) {
      toast({
        title: "Tarea eliminada",
        description: "La tarea ha sido eliminada",
        duration: 5000,
        variant: "default"
      });
      toggle.onClose()
    }
  }

  return (
    <Dialog open={toggle.isOpen} onOpenChange={toggle.onToggle}>
      <DialogTrigger asChild>
        <div>
          <Button variant={"destructive"}>
            <MdDelete />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            Do you want to delete this task?
          </DialogDescription>
        </DialogHeader>
        <Button variant={"destructive"} onClick={() => onDeleteTask(task?.id ?? 0)}>
          Delete
        </Button>
        <Button variant={"secondary"} onClick={toggle.onToggle}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default TaksManagementBodyDeleteDialog