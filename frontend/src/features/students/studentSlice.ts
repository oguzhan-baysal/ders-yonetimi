import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { Student, PaginatedResponse } from '../../types';

interface StudentState {
  items: Student[];
  total: number;
  page: number;
  pages: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  items: [],
  total: 0,
  page: 1,
  pages: 1,
  hasMore: false,
  loading: false,
  error: null,
};

export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (page: number = 1) => {
    const response = await api.get<PaginatedResponse<Student>>(`/students?page=${page}`);
    return response.data;
  }
);

export const createStudent = createAsyncThunk(
  'students/createStudent',
  async (studentData: Partial<Student>) => {
    const response = await api.post<Student>('/students', studentData);
    return response.data;
  }
);

export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async ({ id, studentData }: { id: string; studentData: Partial<Student> }) => {
    const response = await api.put<Student>(`/students/${id}`, studentData);
    return response.data;
  }
);

export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (id: string) => {
    const response = await api.delete<Student>(`/students/${id}`);
    return response.data;
  }
);

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Öğrenciler yüklenemedi';
      });
  },
});

export default studentSlice.reducer; 