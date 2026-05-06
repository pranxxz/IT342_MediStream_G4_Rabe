import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Paper,
  Chip,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import { styled, keyframes } from "@mui/system";
import { ArrowForward, Menu as MenuIcon, Close } from '@mui/icons-material';

import { PatientFormModal } from "../components/PatientFormModal.jsx";
import { GradientButton, OutlineButton, NavButton, NavSideButton } from "../components/ButtonComponents.jsx";

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Styled Components
const AnimatedBox = styled(Box)(({ delay = 0 }) => ({
  animation: `${fadeInUp} 0.8s ease-out ${delay}s both`,
}));

export default function LandingPage() {
  const navigate = useNavigate(); // Hook for navigation
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [patientFormModalOpen, setPatientFormModalOpen] = useState(false);

  const handleOpenPatientFormModal = () => setPatientFormModalOpen(true);
  const handleClosePatientFormModal = () => setPatientFormModalOpen(false);

  // Logic to handle joining the queue from the Landing Page
  const handleQueueSubmit = async (formData) => {
    try {
      const response = await fetch('http://localhost:8080/api/queue/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        
        handleClosePatientFormModal();
        
        // Wait a brief moment for animation then redirect
        setTimeout(() => {
          navigate('/QueueDashboard', { 
            state: { 
              patientData: formData,
              queueNumber: data.queueNumber,
              estimatedTime: data.estimatedTime
            }
          });
        }, 500);
      } else {
        console.error("Failed to join queue");
        // You could add an error snackbar here if you like
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ width: 250, pt: 2, bgcolor: "#2E004F", height: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", px: 2 }}>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => scrollToSection("about")}>
            <Typography color="white">About us</Typography>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => scrollToSection("features")}>
            <Typography color="white">Key features</Typography>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => scrollToSection("benefits")}>
            <Typography color="white">Benefits</Typography>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => scrollToSection("cta")}>
            <Typography color="white">Join Queue</Typography>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', fontFamily: '"Arimo", "Poppins", sans-serif', overflow: 'hidden' }}>
      {/* Navbar / Header */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #6A0DAD 0%, #4B0082 100%)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          color: "white",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 20px rgba(106, 13, 173, 0.3)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: { xs: 64, sm: 80 }, py: 1 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            component="a" 
            href="#"
            sx={{ 
              textDecoration: "none", 
              color: "inherit", 
              cursor: "pointer",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              }
            }}
          >
            <Box
              sx={{
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: 2,
                width: 40,
                height: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 4px 16px rgba(75, 0, 130, 0.4)",
              }}
            >
              <img 
                src="/logo (2).png"
                alt="ClinicaFlow Logo"
                style={{ 
                  width: "70%", 
                  height: "70%", 
                  objectFit: "contain"
                }}
              />
            </Box>
            <Typography variant="h6" fontWeight={700} letterSpacing={0.5}>
              ClinicaFlow
            </Typography>
          </Stack>

          <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <NavButton onClick={() => scrollToSection("about")}>About us</NavButton>
            <NavButton onClick={() => scrollToSection("features")}>Key features</NavButton>
            <NavButton onClick={() => scrollToSection("benefits")}>Benefits</NavButton>
            <NavButton onClick={() => scrollToSection("cta")}>Join Queue</NavButton>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <NavSideButton
              component={Link}
              to="/Login"
            >
              Log in
            </NavSideButton>
            <NavSideButton
              component={Link}
              to="/Register"
            >
              Get Started
            </NavSideButton>
          </Stack>

          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Add padding to account for fixed navbar */}
      <Box sx={{ height: { xs: 64, sm: 80 } }} />

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>

      {/* Hero Section */}
      <Box sx={{ 
        position: "relative",
        background: "#F8F0FF", 
        py: { xs: 8, md: 14 },
        overflow: "hidden",
      }}>
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", md: "row" }, 
              alignItems: "center", 
              gap: 8 
            }}
          >
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
              <Box>
                <AnimatedBox delay={0}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: "#6A0DAD",
                      fontWeight: 700,
                      letterSpacing: 2,
                      mb: 3,
                      display: "block",
                      fontSize: "0.75rem",
                    }}
                  >
                    MODERN HEALTHCARE MANAGEMENT
                  </Typography>
                </AnimatedBox>
                <AnimatedBox delay={0.2}>
                  <Typography
                    variant="h1"
                    fontWeight={900}
                    color="#4B0082"
                    gutterBottom
                    lineHeight={1.1}
                    sx={{ 
                      fontSize: { xs: "2.5rem", md: "3.5rem" },
                      mb: 4,
                    }}
                  >
                    Streamline Your<br />Clinic Operations
                  </Typography>
                </AnimatedBox>
                <AnimatedBox delay={0.4}>
                  <Typography variant="h6" sx={{ color: "#4A148C", mb: 6, lineHeight: 1.7, fontWeight: 400 }}>
                    A complete web-based system for small clinics and<br/>
                    barangay health centers. Manage patient registration,<br/>
                    queues, and consultations in a fast, organized, and digital<br/>
                    way.
                  </Typography>
                </AnimatedBox>
                <AnimatedBox delay={0.6}>
                  <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                    <GradientButton component={Link} to="/Register">
                      Get Started
                    </GradientButton>
                    <OutlineButton component={Link} to="/features">
                      Learn More
                    </OutlineButton>
                  </Stack>
                </AnimatedBox>
              </Box>
            </Box>

            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
              <Box>
                <AnimatedBox delay={0.8}>
                  <Box
                    sx={{
                      background: "linear-gradient(145deg, #6A0DAD 0%, #4B0082 100%)",
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      borderRadius: 6,
                      boxShadow: "0 20px 60px rgba(75, 0, 130, 0.4)",
                      padding: { xs: 3, md: 4 },
                      width: "100%",
                      maxWidth: { xs: '100%', md: 570 }, 
                      mx: 'auto',
                      animation: `${float} 3s ease-in-out infinite`,
                    }}
                  >
                    <Typography variant="h5" fontWeight={700} mb={3} color="white" textAlign="center">
                      Patient Queue
                    </Typography>
                    <Stack spacing={2.5}>
                      {[
                        { num: 1, status: "Consulting", color: "#57cc99" },
                        { num: 2, status: "Waiting", color: "#ffb74d" },
                        { num: 3, status: "Waiting", color: "#ffb74d" }
                      ].map((item, index) => (
                        <Paper
                          key={item.num}
                          elevation={0}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            p: 2.5,
                            borderRadius: 4,
                            background: "rgba(255, 255, 255, 0.95)",
                            border: "2px solid rgba(255, 255, 255, 1)",
                            borderLeft: `6px solid ${item.color}`,
                            animation: `${fadeIn} 0.5s ease-out ${index * 0.15}s both`,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateX(5px)",
                              boxShadow: "0 8px 24px rgba(255, 255, 255, 0.3)",
                            }
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={2.5}>
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                background: "transparent",
                                borderRadius: "30%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontWeight: 800,
                                color: item.color,
                                border: `3px solid ${item.color}`,
                                fontSize: "1.2rem",
                              }}
                            >
                              {item.num}
                            </Box>
                            <Typography variant="h6" fontWeight={700} color="#4B0082">
                              Patient {item.num}
                            </Typography>
                          </Stack>
                          <Chip 
                            label={item.status} 
                            sx={{ 
                              bgcolor: item.color,
                              color: 'white',
                              fontWeight: 800,
                              fontSize: "1rem",
                              px: 2.5, 
                              py: 0.5,
                              borderRadius: 8 ,
                              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                              ml: 2, 
                            }} 
                          />
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                </AnimatedBox>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Why ClinicaFlow Section */}
      <Box 
        id="about"
        sx={{ 
          py: 12, 
          background: "linear-gradient(135deg, #6A0DAD 0%, #4B0082 100%)",
          position: "relative",
          scrollMarginTop: "50px", 
        }} 
      >
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: 6,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.8)",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 24px 60px rgba(0, 0, 0, 0.15)",
              }
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700} color="#4B0082" mb={3}>
                Why ClinicaFlow?
              </Typography>
              <Typography sx={{ color: "#4A148C", lineHeight: 1.8 }} variant="body1">
                We are dedicated to helping clinics operate more efficiently through
                modern, streamlined digital tools. Our system simplifies patient
                registration, queue management, and consultation tracking—making daily
                operations smoother for staff and more convenient for patients.
                Designed for small clinics and community health centers, we focus on
                speed, accuracy, and a better overall patient experience.
              </Typography>
            </Box>

            <Box sx={{ flex: 1, textAlign: "center" }}>
              <img
                src="/Layer_2.png"
                alt="Illustration - working on laptop"
                style={{ 
                  maxWidth: "100%", 
                  height: "auto", 
                  borderRadius: 16,
                  filter: "drop-shadow(0 10px 30px rgba(106, 13, 173, 0.2))",
                }}
                loading="lazy"
              />
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Features Section */}
      <Box 
        id="features"
        sx={{ 
          py: 12,
          background: "#ffffff",
          scrollMarginTop: "40px", 
        }} 
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            fontWeight={700}
            color="#4B0082"
            textAlign="center"
            mb={10}
          >
            Highlights & Key Features
          </Typography>

          <Stack spacing={6}>
            {/* Feature 1 */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: 6,
                border: "1px solid #e0e0e0",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 16px 48px rgba(106, 13, 173, 0.12)",
                  borderColor: "#6A0DAD",
                },
              }}
            >
              <Box sx={{ flex: 1}}>
                <Typography variant="h5" fontWeight={700} color="#4B0082" mb={2}>
                  Patient Management
                </Typography>
                <Typography sx={{ color: "#4A148C", lineHeight: 1.8 }} variant="body1" mb={3}>
                  Easily add, update, and view patient records in one centralized system.
                  Maintain complete and accurate information about each patient — including
                  contact details, medical history, and visit logs. This feature eliminates
                  the need for manual paper records and ensures every consultation is backed
                  by accessible patient data.
                </Typography>
                <Button 
                  variant="text" 
                  component={Link}
                  to="/patient-management"
                  endIcon={<ArrowForward />}
                  sx={{ 
                    color: '#6A0DAD', 
                    fontWeight: 600, 
                    textTransform: 'none',
                  }}
                >
                  Explore Patient Records
                </Button>
              </Box>
              <Box sx={{ flex: 1, textAlign: "center" }}>
                <img
                  src="/feature1.png"
                  alt="Patient Management"
                  style={{ 
                    maxWidth: "100%", 
                    height: "auto", 
                    maxHeight: 220,
                  }}
                  loading="lazy"
                />
              </Box>
            </Paper>

            {/* Feature 2 */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                display: "flex",
                flexDirection: { xs: "column", md: "row-reverse" },
                alignItems: "center",
                gap: 6,
                border: "1px solid #e0e0e0",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 16px 48px rgba(106, 13, 173, 0.12)",
                  borderColor: "#6A0DAD",
                },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" fontWeight={700} color="#4B0082" mb={2}>
                  Queue Tracking
                </Typography>
                <Typography sx={{ color: "#4A148C", lineHeight: 1.8 }} variant="body1" mb={3}>
                  Monitor and manage active patient queues efficiently in real time. The system
                  automatically updates queue status, allowing staff to see who's next and how
                  long each patient has been waiting. This ensures a smoother clinic flow,
                  reduces patient frustration, and optimizes staff scheduling.
                </Typography>
                <Button 
                  variant="text" 
                  component={Link}
                  to="/queue-tracking"
                  endIcon={<ArrowForward />}
                  sx={{ 
                    color: '#6A0DAD', 
                    fontWeight: 600, 
                    textTransform: 'none',
                  }}
                >
                  Explore Queue Manager
                </Button>
              </Box>
              <Box sx={{ flex: 1, textAlign: "center" }}>
                <img
                  src="/feature2.png"
                  alt="Queue Tracking"
                  style={{ 
                    maxWidth: "100%", 
                    height: "auto", 
                    maxHeight: 220,
                  }}
                  loading="lazy"
                />
              </Box>
            </Paper>

            {/* Feature 3 */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: 6,
                border: "1px solid #e0e0e0",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 16px 48px rgba(106, 13, 173, 0.12)",
                  borderColor: "#6A0DAD",
                },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" fontWeight={700} color="#4B0082" mb={2}>
                  Consultation Records
                </Typography>
                <Typography sx={{ color: "#4A148C", lineHeight: 1.8 }} variant="body1" mb={3}>
                  Keep a digital history of patient consultations securely stored and easy to retrieve.
                  Doctors can record diagnoses, treatments, and prescriptions with just a few clicks.
                  This makes it simple to review past visits, support better decision-making, and provide
                  personalized patient care.
                </Typography>
                <Button 
                  variant="text" 
                  component={Link}
                  to="/consultation"
                  endIcon={<ArrowForward />}
                  sx={{ 
                    color: '#6A0DAD', 
                    fontWeight: 600, 
                    textTransform: 'none',
                  }}
                >
                  Explore Consultation Module
                </Button>
              </Box>
              <Box sx={{ flex: 1, textAlign: "center" }}>
                <img
                  src="/feature3.png"
                  alt="Consultation Records"
                  style={{ 
                    maxWidth: "100%", 
                    height: "auto", 
                    maxHeight: 220,
                  }}
                  loading="lazy"
                />
              </Box>
            </Paper>
          </Stack>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box 
        id="benefits"
        sx={{ 
          py: 20,
          bgcolor: "#F3E5F5",
          scrollMarginTop: "40px", 
        }} 
      >
        <Container maxWidth="md">
          <Box textAlign="center" sx={{ px: 2 , border: "2px solid rgba(106, 13, 173, 0.2)", py: 10, borderRadius: 4, background: "rgba(255, 255, 255, 0.8)" }}>
            <Typography
              variant="h6"
              fontWeight={700}
              color="#6A0DAD"
              gutterBottom
              textAlign="center"
            >
              What You Gain
            </Typography>
            <Typography
              variant="h4"
              fontWeight={700}
              color="#4B0082"
              textAlign="center"
              mb={4}
            >
              Maximize Efficiency & Patient Satisfaction
            </Typography>
            <Typography
              variant="body1"
              color="#4A148C"
              textAlign="center"
              sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.8 }}
            >
              Our platform reduces waiting times, improves data accuracy, and helps
              clinics deliver faster, more organized patient care. With real-time queue
              updates, secure digital records, and a simplified workflow, staff can work
              more efficiently while patients enjoy a smoother and more convenient clinic
              experience.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box 
        id="cta" 
        sx={{ 
          py: 20, 
          background: "linear-gradient(135deg, #6A0DAD 0%, #4B0082 100%)", 
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          scrollMarginTop: "20px", 
        }}
      >
        <Container maxWidth="md" sx={{ 
          position: "relative", 
          zIndex: 1, 
          background: "#ffffff",
          borderRadius: 4, 
          p: 6, 
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
        }}>
          <Typography 
            variant="h3" 
            fontWeight={700} 
            color="#6A0DAD"
            sx={{ py: 5, }}
          >
            Skip the Line. Join Us Online
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: "#6A0DAD",
              mb: 4, 
              maxWidth: 600, 
              mx: "auto",
              lineHeight: 1.8,
            }}
          >
            Register yourself in the patient queue from the comfort of your home. No need to wait at
            the clinic - we'll notify you when it's your turn.
          </Typography>
          
          <GradientButton 
            sx={{ 
              width: "100%", 
              maxWidth: 400,
              mx: "auto", 
              display: "block",
              my: 5,
              py: 1,
            }} 
            onClick={handleOpenPatientFormModal}
          >
            Join Queue Now
          </GradientButton>

          {/* Double checked: Renamed to PatientFormModal */}
          <PatientFormModal 
            open={patientFormModalOpen}
            onClose={handleClosePatientFormModal}
            onSubmit={handleQueueSubmit}
            title="Join Queue"
            subtitle="Enter details to get a queue number."
            submitLabel="Submit & Join Queue"
          />
          
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 2,
              color: "#6A0DAD",
              opacity: 0.8,
              pb: 5
            }}
          >
            You'll receive a queue number immediately after registration
          </Typography>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "#2E004F", py: 6, color: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", pt: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © {new Date().getFullYear()} ClinicaFlow. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}