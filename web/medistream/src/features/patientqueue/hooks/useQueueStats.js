import { useMemo } from 'react';

export const useQueueStats = (patients = []) => {  // Add default empty array
  const patientStats = useMemo(() => [
    {
      id: 1,
      title: 'Total Patients',
      value: patients.length.toString(),
      subText: 'In queue today',
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 2,
      title: 'Waiting',
      value: patients.filter(p => p.status === 'Waiting').length.toString(),
      subText: 'Average: 15 minutes',
      color: '#ed6c02',
      gradient: 'linear-gradient(135deg, #ed6c02 0%, #f57c00 100%)'
    },
    {
      id: 3,
      title: 'Consulting',
      value: patients.filter(p => p.status === 'Consulting').length.toString(),
      subText: 'Currently with doctor',
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 4,
      title: 'Completed',
      value: patients.filter(p => p.status === 'Completed').length.toString(),
      subText: 'Sessions completed',
      color: '#2e7d32',
      gradient: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)'
    }
  ], [patients]);

  return { patientStats };
};