import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { Course, PaginatedResponse } from '../../types';

interface CourseState {
  items: Course[];
  total: number;
  page: number;
  pages: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  items: [],
  total: 0,
  page: 1,
  pages: 1,
  hasMore: false,
  loading: false,
  error: null,
};

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (page: number = 1) => {
    const response = await api.get<PaginatedResponse<Course>>(`/courses?page=${page}`);
    return response.data;
  }
);

export const createCourse = createAsyncThunk(
  'courses/createCourse',
  async (courseData: Partial<Course>) => {
    const response = await api.post<Course>('/courses', courseData);
    return response.data;
  }
);

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, courseData }: { id: string; courseData: Partial<Course> }) => {
    const response = await api.put<Course>(`/courses/${id}`, courseData);
    return response.data;
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (id: string) => {
    const response = await api.delete<Course>(`/courses/${id}`);
    return response.data;
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Dersler yüklenemedi';
      });
  },
});

export default courseSlice.reducer; 