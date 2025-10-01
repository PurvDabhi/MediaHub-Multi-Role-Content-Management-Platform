import toast from 'react-hot-toast';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: any) => {
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.message || 'An error occurred';
    
    switch (status) {
      case 401:
        toast.error('Authentication required');
        break;
      case 403:
        toast.error('Access denied');
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(message);
    }
    
    throw new AppError(message, data?.code, status);
  } else {
    toast.error('Network error. Please check your connection.');
    throw new AppError('Network error');
  }
};