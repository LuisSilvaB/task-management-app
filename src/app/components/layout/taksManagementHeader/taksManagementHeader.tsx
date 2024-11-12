import React from 'react'
import { poppins } from '@/fonts'
import { filterTaskByState, getAllTasks, searchTaskByName } from "@/app/features/task.feature";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TaksManagementBodyDialog from '../../ui/dialogs/taksManagementBodyDialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { revalidatePath } from 'next/cache';
import { MdFilterAltOff } from "react-icons/md";

const TaksManagementHeader = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const fetchTasks = async () => {
    await dispatch(getAllTasks());
  };

  const onSearchTaskByName = async (name: string) => {
    const dataSearched = dispatch(searchTaskByName(name));
  }

  const onFilterTaskByState = async (state: boolean) => {
    const dataFiltered = dispatch(filterTaskByState(state));
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div
      className={`w-full flex flex-col justify-between gap-2 items-center h-20 px-5 text-3xl mb-2 bg-gradient-to-r outline from-violet-500 to-purple-500 bg-clip-text text-transparent ${poppins.className}`}
    >
      <div className="flex flex-row justify-between items-center w-full">
        <p className="underline">Task Management app</p>
        <TaksManagementBodyDialog />
      </div>
      <div className='w-full flex items-center gap-2'>
        <Input
          placeholder="find task by name"
          className="w-full"
          onChange={(e) => onSearchTaskByName(e.target.value)}
        />
        <div className='flex flex-row gap-2 items-center'>
          <Button className='bg-green-500 hover:bg-green-700' onClick={() => onFilterTaskByState(true)}>DONE</Button>
          <Button className='bg-orange-500 hover:bg-orange-700' onClick={() => onFilterTaskByState(false)}>PENDING</Button>
          <Button variant={"outline"} className='text-gray-700' onClick={fetchTasks}>
            <MdFilterAltOff/>
          </Button>
          
        </div>
      </div>
    </div>
  );
}

export default TaksManagementHeader