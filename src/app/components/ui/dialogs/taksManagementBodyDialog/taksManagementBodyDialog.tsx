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
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { MdAdd, MdEdit } from "react-icons/md";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { addTask, changeTaskState, updateTask } from "@/app/features/task.feature";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

type TaksManagementBodyDialogProps = {
  task?: TaskType;
}

const TaksManagementBodyDialog = ({ task } :TaksManagementBodyDialogProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const toggle = useToggle(false)

  const formMethods = useForm<Omit<TaskType, "id" | "created_at">>({
    resolver: zodResolver(TaskResolver),
    defaultValues: {
      title: "",
      description: "",
      state: false,
    },
    mode:"all"
  })


  const onAddTask: SubmitHandler<Omit<TaskType, "id" | "created_at">> = async (data) => {
    const dataCreated = dispatch(addTask(data))
    if ((await dataCreated).payload) {
      toast({
        title: "Tarea creada",
        description: "La tarea ha sido creada",
        duration: 5000,
        variant: "default"
      });
      toggle.onClose()
    }
  }

  const onEditTask: SubmitHandler<Omit<TaskType, "id" | "created_at">> = async (data) => {
    const dataEdited = dispatch(updateTask({ task: data, id: task?.id ?? 0 }))
    if ((await dataEdited).payload) {
      toast({
        title: "Tarea actualizada",
        description: "La tarea ha sido actualizada",
        duration: 5000,
        variant: "default"
      });
      toggle.onClose()
    }
  }

  const onError = (error: FieldErrors<Omit<TaskType, "id" | "created_at">>) => {
    toast({
      title: "Vefifique los campos ingresados",
      description: "Error al registrar",
      duration: 5000,
      variant: "destructive"
    });
  }
  useEffect(() => {
    if (toggle.isOpen) {
      if (task) {
        formMethods.setValue("title", task.title);
        formMethods.setValue("description", task.description);
        formMethods.setValue("state", task.state);
      } else {
        formMethods.reset({
          title: "",
          description: "",
          state: false,
        });
      }
    }
  }, [toggle.isOpen, task, formMethods]);

  return (
    <FormProvider {...formMethods}>
      <Dialog open={toggle.isOpen} onOpenChange={toggle.onToggle}>
        <DialogTrigger asChild>
          <div>
            <Button
              variant={"default"}
              className="flex items-center gap-2 px-4 py-2"
              onClick={toggle.onToggle}
            >
              <span>{task ? "Edit" : "Add"}</span>
              {task ? <MdEdit /> : <MdAdd />}
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{task ? "Edit Task" : "Add Task"}</DialogTitle>
            <DialogDescription>
              {task
                ? " Do you want to edit this task?"
                : " Do you want to add a new task?"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={task ? formMethods.handleSubmit(onEditTask, onError) : formMethods.handleSubmit(onAddTask, onError)}>
            <FormField
              control={formMethods.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="title" {...field} />
                  </FormControl>
                  <FormDescription>The title of the task</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMethods.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="description" {...field} />
                  </FormControl>
                  <FormDescription>The description of the task</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMethods.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-1 w-fit mt-2 items-center flex-row-reverse">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={()=>{
                        field.onChange(!field.value)
                      }} />
                    </FormControl>
                  </div>
                  <FormDescription>The status of the task</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          <DialogFooter>
            <Button type="submit" variant={"default"} onClick={toggle.onToggle}>{ task ? "save" : "add" }</Button>
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}

export default TaksManagementBodyDialog