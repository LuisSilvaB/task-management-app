import { toast } from "@/hooks/use-toast";
import { createSupabaseBrowserClient } from "@/libs/supabase/browser-client";
import { TaskType } from "@/app/types/taks.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const supabase = createSupabaseBrowserClient();

export const getAllTasks = createAsyncThunk(
  "task/getAllTasks",
  async (_, {rejectWithValue}) => {
    try{
      const { data, error } = await supabase.from("TASKS").select("*");

      if (error) {
        toast({
          title: "Error",
          description: "Error al obtener las tareas",
          variant: "destructive",
        })
        return rejectWithValue(error);
      }

      return data as TaskType[];

    } catch(error){
      toast({
        title: "Error",
        description: "Error al obtener las tareas",
        variant: "destructive",
      })
      return rejectWithValue(error);
    }
  }
) 

export const addTask = createAsyncThunk(
  "task/addTask",
  async (task: Omit<TaskType, "id" | "created_at">, {rejectWithValue}) => {
    try{
      const { data, error } = await supabase.from("TASKS").insert(task).select("*").single();

      if (error) {
        toast({
          title: "Error",
          description: "Error al agregar la tarea",
          variant: "destructive",
        })
        return rejectWithValue(error);
      }

      return data as TaskType;

    } catch(error){
      toast({
        title: "Error",
        description: "Error al agregar la tarea",
        variant: "destructive",
      })
      return rejectWithValue(error);
    }
  }
)

export const updateTask = createAsyncThunk(
  "task/updateTask",
  async ({task, id}: {task: Omit<TaskType, "id" | "created_at">, id: number}, {rejectWithValue}) => {
    try{
      const { data, error } = await supabase.from("TASKS").update(task).eq("id", id).select("*").single();

      if (error) {
        toast({
          title: "Error",
          description: "Error al actualizar la tarea",
          variant: "destructive",
        })
        return rejectWithValue(error);
      }

      return data as TaskType;

    } catch(error){
      toast({
        title: "Error",
        description: "Error al actualizar la tarea",
        variant: "destructive",
      })
      return rejectWithValue(error);
    }
  }
)

export const changeTaskState = createAsyncThunk(
  "task/changeTaskState",
  async ({id, state}:{id: number, state: boolean}, {rejectWithValue}) => {
    try{
      const { data, error } = await supabase.from("TASKS").update({state: !state}).eq("id", id).select("*").single();

      if (error) {
        toast({
          title: "Error",
          description: "Error al actualizar la tarea",
          variant: "destructive",
        })
        return rejectWithValue(error);
      }

      return data as TaskType;

    } catch(error){
      toast({
        title: "Error",
        description: "Error al actualizar la tarea",
        variant: "destructive",
      })
      return rejectWithValue(error);
    }
  }
) 

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id: number, {rejectWithValue}) => {
    try{
      const { data, error } = await supabase.from("TASKS").delete().eq("id", id).select("*").single();

      if (error) {
        toast({
          title: "Error",
          description: "Error al eliminar la tarea",
          variant: "destructive",
        })
        return rejectWithValue(error);
      }

      return data as TaskType;

    } catch(error){
      toast({
        title: "Error",
        description: "Error al eliminar la tarea",
        variant: "destructive",
      })
      return rejectWithValue(error);
    }
  }
)

export const searchTaskByName = createAsyncThunk(
  "task/searchTaskByName",
  async (name: string, {rejectWithValue}) => {
    try{
      const trimmedQuery = name.trim(); 
      const { data, error } = await supabase.from("TASKS").select("*").ilike("title", `%${trimmedQuery}%`);
      if (error) {
        toast({
          title: "Error",
          description: "Error al buscar la tarea",
          variant: "destructive",
        })
        return rejectWithValue(error);
      }

      return data as TaskType[];

    } catch(error){
      toast({
        title: "Error",
        description: "Error al buscar la tarea",
        variant: "destructive",
      })
      return rejectWithValue(error);
    }
  }
)

export const filterTaskByState = createAsyncThunk( 
  "task/onFilterTaskByState",
  async (state: boolean, {rejectWithValue}) => {
    try{
      const { data, error } = await supabase.from("TASKS").select("*").eq("state", state);
      if (error) {
        toast({
          title: "Error",
          description: "Error al buscar la tarea",
          variant: "destructive",
        })
        return rejectWithValue(error);
      }

      return data as TaskType[];

    } catch(error){
      toast({
        title: "Error",
        description: "Error al buscar la tarea",
        variant: "destructive",
      })
      return rejectWithValue(error);
    }
  }
)

const taskSlice = createSlice({
  name: "task",
  initialState: {
    tasks: [] as TaskType[],
    loadingTasks: false,
    loadingDelteTask: false,
    loadingAddTask: false,
    loadingUpdateTask: false,
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    // getAllTasks
    builder.addCase(getAllTasks.pending, (state, action) => {
      state.loadingTasks = true;
    });
    builder.addCase(getAllTasks.fulfilled, (state, action) => {
      state.loadingTasks = false;
      state.tasks = action.payload ?? [];
    });
    builder.addCase(getAllTasks.rejected, (state, action) => {
      state.loadingTasks = false;
      state.tasks = [];
    });
    // addTask
    builder.addCase(addTask.pending, (state, action) => {
      state.loadingAddTask = true;
    });
    builder.addCase(addTask.fulfilled, (state, action) => {
      state.loadingAddTask = false;
      state.tasks.push(action.payload);
    });
    builder.addCase(addTask.rejected, (state, action) => {
      state.loadingAddTask = false;
    });
    // updateTask
    builder.addCase(updateTask.pending, (state, action) => {
      state.loadingUpdateTask = true;
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      state.loadingUpdateTask = false;
      state.tasks = state.tasks.map((task) => {
        if (task.id === action.payload.id) {
          return action.payload;
        }
        return task;
      });
    });
    builder.addCase(updateTask.rejected, (state, action) => {
      state.loadingUpdateTask = false;
    });

    // deleteTask
    builder.addCase(deleteTask.pending, (state, action) => {
      state.loadingDelteTask = true;
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.loadingDelteTask = false;
      state.tasks = state.tasks.filter((task) => task.id !== action.payload.id);
    });
    builder.addCase(deleteTask.rejected, (state, action) => {
      state.loadingDelteTask = false;
    });   

    // onChangeTaskState
    builder.addCase(changeTaskState.pending, (state, action) => {
      state.loadingUpdateTask = true;
    });
    builder.addCase(changeTaskState.fulfilled, (state, action) => {
      state.loadingUpdateTask = false;
      state.tasks = state.tasks.map((task) => {
        if (task.id === action.payload.id) {
          return action.payload;
        }
        return task;
      });
    });
    builder.addCase(changeTaskState.rejected, (state, action) => {
      state.loadingUpdateTask = false;
    });

    // searchTaskByName
    builder.addCase(searchTaskByName.pending, (state, action) => {
      state.loadingTasks = true;
    });
    builder.addCase(searchTaskByName.fulfilled, (state, action) => {
      state.loadingTasks = false;
      state.tasks = action.payload ?? [];
    });
    builder.addCase(searchTaskByName.rejected, (state, action) => {
      state.loadingTasks = false;
    });

    // onFilterTaskByState
    builder.addCase(filterTaskByState.pending, (state, action) => {
      state.loadingTasks = true;
    });
    builder.addCase(filterTaskByState.fulfilled, (state, action) => {
      state.loadingTasks = false;
      state.tasks = action.payload ?? [];
    });
    builder.addCase(filterTaskByState.rejected, (state, action) => {
      state.loadingTasks = false;
    }); 
  }, 

});

export const { setTasks } = taskSlice.actions;
export default taskSlice.reducer;
