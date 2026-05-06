import { useState, useMemo, useEffect } from "react";
import dayjs from 'dayjs';
import { patientService } from "../services/patientService";
import { consultationService } from "../services/consultationService";
import { staffService } from "../services/staffService";

const gender = [
  { value: 'Female', label: 'Female' },
  { value: 'Male', label: 'Male' }
];

const quickTemplates = [
  {
    id: 1,
    name: "Fever / Common Cold",
    symptoms: "Fever, runny nose, cough, sore throat",
    diagnosis: "Upper respiratory tract infection",
    prescription: "Paracetamol 500mg every 6 hours, rest, plenty of fluids",
    remarks: "Monitor temperature, return if symptoms worsen"
  },
  {
    id: 2,
    name: "Headache",
    symptoms: "Persistent headache, sensitivity to light",
    diagnosis: "Tension headache",
    prescription: "Ibuprofen 400mg as needed, stress management",
    remarks: "Avoid triggers, maintain hydration"
  },
  {
    id: 3,
    name: "Hypertension",
    symptoms: "Elevated blood pressure, occasional dizziness",
    diagnosis: "Stage 1 Hypertension",
    prescription: "Lisinopril 10mg daily, lifestyle modifications",
    remarks: "Regular BP monitoring, low sodium diet"
  }
];

export const useConsultation = () => {
  const [doctors, setDoctors] = useState([]);

  const [patientInfo, setPatientInfo] = useState({
    patientId: '',
    name: '',
    age: '',
    gender: '',
    doctor: '',
    date: dayjs()
  });

  const [consultationDetails, setConsultationDetails] = useState({
    symptoms: '',
    diagnosis: '',
    prescription: '',
    remarks: ''
  });

  const [todayConsultations, setTodayConsultations] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchInitialData = async () => {
      // --- Fetch Doctors ---
      try {
        const staffData = await staffService.getAllStaff();
        
        const doctorOptions = staffData
          .filter(staff => staff.role === 'Doctor' || staff.role === 'doctor')
          .map(doctor => ({
            value: doctor.staffId || doctor.id, 
            label: doctor.name || doctor.fullName 
          }));
          
        setDoctors(doctorOptions);
      } catch (error) {
        console.error("Failed to load doctors", error);
      }

      // --- Fetch Consultations Count ---
      try {
        const consultations = await consultationService.getAllConsultations();
        setTodayConsultations(consultations.length);
      } catch (error) {
        console.error("Failed to load consultations", error);
      }
    };

    fetchInitialData();
  }, []);

  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]*$/;
    return nameRegex.test(name);
  };

  const validateAge = (age) => {
    const ageRegex = /^\d*$/;
    return ageRegex.test(age);
  };

  const handlePatientInfoChange = (field, value) => {
    let isValid = true;
    
    setErrors(prev => ({ ...prev, [field]: '' }));

    if (field === 'name') {
      isValid = validateName(value);
      if (!isValid && value !== '') {
        setErrors(prev => ({ ...prev, name: 'Name can only contain letters' }));
      }
    }
    
    if (field === 'age') {
      isValid = validateAge(value);
      if (!isValid && value !== '') {
        setErrors(prev => ({ ...prev, age: 'Age can only contain numbers' }));
      }
    }

    if (isValid || value === '') {
      setPatientInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleConsultationChange = (field, value) => {
    setConsultationDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyTemplate = (templateId) => {
    const template = quickTemplates.find(t => t.id === templateId);
    if (template) {
      setConsultationDetails({
        symptoms: template.symptoms,
        diagnosis: template.diagnosis,
        prescription: template.prescription,
        remarks: template.remarks
      });
    }
  };

  const saveConsultation = async () => {
    setErrors({});
    const newErrors = {};
    
    if (!patientInfo.name) newErrors.name = 'Patient name is required';
    else if (!validateName(patientInfo.name)) newErrors.name = 'Name can only contain letters';
    
    if (!patientInfo.doctor) newErrors.doctor = 'Doctor selection is required';
    if (!patientInfo.date) newErrors.date = 'Date is required';
    if (!consultationDetails.symptoms) newErrors.symptoms = 'Symptoms are required';
    if (!consultationDetails.diagnosis) newErrors.diagnosis = 'Diagnosis is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return { success: false, message: "Please fix the highlighted errors in the form." };
    }

    const pId = parseInt(patientInfo.patientId);
    
    if (isNaN(pId)) {
       return { success: false, message: "Invalid Patient ID." };
    }

    const selectedDate = patientInfo.date 
      ? dayjs(patientInfo.date).format('YYYY-MM-DD') 
      : dayjs().format('YYYY-MM-DD');

    const consultationPayload = {
      patientId: pId,
      staffId: parseInt(patientInfo.doctor), 
      symptoms: consultationDetails.symptoms,
      diagnosis: consultationDetails.diagnosis,
      medicinePrescribed: consultationDetails.prescription, 
      remarks: consultationDetails.remarks,
      consultationDate: selectedDate
    };

    try {
      // console.log("Sending to Backend:", consultationPayload);
      
      // 4. Call Backend
      await consultationService.addConsultation(consultationPayload);
      
      setPatientInfo({
        patientId: '',
        name: '',
        age: '',
        gender: '',
        doctor: '',
        date: dayjs()
      });
      setConsultationDetails({
        symptoms: '',
        diagnosis: '',
        prescription: '',
        remarks: ''
      });
      setErrors({});
      setTodayConsultations(prev => prev + 1);
      
      return { success: true };
      
    } catch (error) {
      console.error("Save Error:", error);
      
      return { success: false, message: "Server Error: Failed to save consultation." };
    }
  };

  const getDoctorLabel = () => {
    const doctorValue = patientInfo.doctor;
    if (doctorValue === undefined || doctorValue === null || doctorValue === "") return "";
    
    const doctorValueStr = String(doctorValue);
    const foundDoctor = doctors.find(d => String(d.value) === doctorValueStr);
    
    return foundDoctor ? foundDoctor.label : "Not found";
  };

  const isFormValid = useMemo(() => {
    return patientInfo.name && 
           validateName(patientInfo.name) &&
           patientInfo.doctor && 
           patientInfo.date && 
           consultationDetails.symptoms && 
           consultationDetails.diagnosis;
  }, [patientInfo, consultationDetails]);

  const handlePatientIdSearch = async (id) => {
    if (!id) return;

    setErrors(prev => ({ ...prev, patientId: '' }));

    try {
        // console.log("Searching for patient ID:", id);
        
        const data = await patientService.getPatientById(id);

        if (data) {
            setPatientInfo(prev => ({
                ...prev,
                name: `${data.firstName} ${data.lastName}`,
                age: String(data.age),
                gender: data.gender,
            }));
        } else {
            setErrors(prev => ({ ...prev, patientId: "Patient ID not found" }));
        }

    } catch (error) {
        console.error("Patient not found", error);
        
        setErrors(prev => ({ ...prev, patientId: "Patient ID not found" }));
        
        setPatientInfo(prev => ({
            ...prev,
            name: '',
            age: '',
            gender: ''
        }));
    }
  };

  return {
    patientInfo,
    consultationDetails,
    todayConsultations,
    gender,
    doctors,
    quickTemplates,
    errors,
    handlePatientInfoChange,
    handleConsultationChange,
    handlePatientIdSearch,
    applyTemplate,
    saveConsultation,
    getDoctorLabel,
    isFormValid
  };
};