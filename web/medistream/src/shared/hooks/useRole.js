import { useAuth } from '../../features/authentication/hooks/useAuth';

export const useRole = () => {
  const { getCurrentUser } = useAuth();

  const getCurrentRole = () => {
    const user = getCurrentUser();
    return user?.role?.toLowerCase() || null;
  };

  const hasRole = (requiredRoles) => {
    const userRole = getCurrentRole();
    if (!userRole) return false;
    
    // If requiredRoles is a string, convert to array
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return rolesArray.some(role => role.toLowerCase() === userRole);
  };

  const canAccessPage = (pageName) => {
    const userRole = getCurrentRole();
    
    if (!userRole) return false;

    const rolePageAccess = {
      'Patient': ['nurse', 'staff', 'doctor', 'admin'],
      'Consultations': ['doctor', 'admin'],
      'MedicalHistory': ['nurse', 'staff', 'doctor', 'admin'],
      'PatientQueue': ['nurse', 'staff', 'doctor', 'admin'],
      'Staff': ['nurse', 'staff', 'doctor', 'admin'],
    };

    const allowedRoles = rolePageAccess[pageName] || [];
    return allowedRoles.includes(userRole);
  };

  const canAddStaff = () => {
    return hasRole('admin');
  };

  const isAdmin = () => {
    return hasRole('admin');
  };

  const isDoctor = () => {
    return hasRole('doctor');
  };

  const isNurse = () => {
    return hasRole('nurse');
  };

  const isStaff = () => {
    return hasRole('staff');
  };

  return {
    getCurrentRole,
    hasRole,
    canAccessPage,
    canAddStaff,
    isAdmin,
    isDoctor,
    isNurse,
    isStaff,
  };
};
