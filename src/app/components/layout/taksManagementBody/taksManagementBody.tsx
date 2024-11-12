import { AppDispatch, RootState } from '@/redux/store';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";  
import { TaskType } from '@/app/types/taks.type';
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from '@/components/ui/scroll-area';
import { changeTaskState } from '@/app/features/task.feature';
import { toast } from '@/hooks/use-toast';
import TaksManagementBodyDialog from '../../ui/dialogs/taksManagementBodyDialog';
import TaksManagementBodyDeleteDialog from '../../ui/dialogs/taksManagementBodyDeleteDialog';
import { MdOutlineWatchLater } from "react-icons/md";
import moment from 'moment-timezone';


const TaksManagementBody = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state:RootState) => state.task.tasks);

  const onChangeTaskState = async (id: number, currentState: boolean) => {
    const dataChanged = dispatch(changeTaskState({ id, state: currentState }));
    if ((await dataChanged).payload) {
      toast({
        title: "Estado cambiado",
        description: "El estado de la tarea ha sido cambiado",
        duration: 5000,
        variant: "default"
      });
    }
  }

  return (
    <ScrollArea className="lg:flex-1 w-full px-5 mt-4">
      <div className="flex flex-1 justify-start items-start w-full mt-2 flex-col gap-2 flex-wrap ">
        {tasks.length
          ? tasks.map((task: TaskType, index: number) => (
              <Card key={index} className="w-full">
                <CardHeader className="flex flex-row justify-between items-center">
                  <div className="flex flex-row gap-2 items-center">
                    <Checkbox onCheckedChange={() => onChangeTaskState(task.id, task.state)} checked={task.state} />
                    <CardTitle>{task.title}</CardTitle>
                  </div>
                  <Badge variant={task.state ? "default" : "destructive"} className={task.state ? "bg-green-500" : "bg-orange-700"}>
                    {task.state ? "Done" : "Pending"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p>{task.description}</p>
                </CardContent>
                <CardFooter>
                  <div className='flex gap-2 items-center'>
                    <MdOutlineWatchLater />
                    <p className='text-gray-500 text-xs'>Created at: {moment(task.created_at).tz("America/Lima").format("YYYY-MM-DD hh:mm:ss A")}</p>
                  </div>
                  <div className="flex flex-row w-full justify-end items-center gap-2">
                    <TaksManagementBodyDialog task={task} />
                    <TaksManagementBodyDeleteDialog task={task} />
                  </div>
                </CardFooter>
              </Card>
            ))
          : null}
      </div>
    </ScrollArea>
  );
}

export default TaksManagementBody