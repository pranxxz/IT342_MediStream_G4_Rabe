import React, { useState } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import { styled, keyframes } from "@mui/system";
import QueueModalForm from "../../features/patientqueue/components/QueueModalForm";
import { queueService } from "../../features/patientqueue/services/queueService";

const MAROON      = "#660013";   
const MAROON_DARK = "#44000d";   
const MAROON_MID  = "#880019";   
const OFF_WHITE   = "#F5F5F5";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
`;

const AnimatedBox = styled(Box)(({ delay = 0 }) => ({
  animation: `${fadeInUp} 0.7s ease-out ${delay}s both`,
}));

export default function LandingPage() {
  const navigate = useNavigate();

  const [queueModalOpen,   setQueueModalOpen]  = useState(false);
  const [queueSubmitting,  setQueueSubmitting] = useState(false);

  const handleOpenQueueModal  = () => setQueueModalOpen(true);
  const handleCloseQueueModal = () => setQueueModalOpen(false);

  // Identical submit handler to LoginPage
  const handleQueueSubmit = async (patientData) => {
    setQueueSubmitting(true);
    try {
      const formattedData = {
        ...patientData,
        age:    patientData.age ? Number(patientData.age) : null,
        status: "Waiting",
      };

      const result = await queueService.joinQueue(formattedData);

      handleCloseQueueModal();

      navigate("/QueueDashboard", { state: { queueNumber: result.queueNumber } });

    } catch (error) {
      console.error("Queue submission error:", error);
      const errorMsg =
        error.response?.data || "Failed to join queue. Please try again.";
      alert(
        typeof errorMsg === "string"
          ? errorMsg
          : "Network error. Please check your connection."
      );
    } finally {
      setQueueSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        fontFamily: '"Inter", "Helvetica Neue", sans-serif',
        bgcolor: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ bgcolor: MAROON_DARK, borderBottom: "none" }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: { xs: 56, sm: 64 },
            px: { xs: 2, sm: 4 },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 36,
                height: 36,
                bgcolor: "rgba(255,255,255,0.15)",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/logo (2).png"
                alt="MediStream Logo"
                style={{ width: "65%", height: "65%", objectFit: "contain" }}
              />
            </Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ color: "white", letterSpacing: 0.3, fontSize: "1.05rem" }}
            >
              MediStream
            </Typography>
          </Stack>

          <Button
            component={Link}
            to="/Login"
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "rgba(255,255,255,0.6)",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 0.75,
              fontSize: "0.875rem",
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            Log in
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ height: { xs: 56, sm: 64 } }} />

      {/* ── Hero Section ───────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: "relative",
          bgcolor: OFF_WHITE,
          pt: { xs: 8, md: 12 },
          pb: 0,
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
              gap: { xs: 6, md: 6 },
              pb: { xs: 6, md: 10 },
            }}
          >
            {/* Left: Text */}
            <Box sx={{ flex: 1, maxWidth: { md: "45%" } }}>
              <AnimatedBox delay={0}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    bgcolor: MAROON,
                    color: "white",
                    borderRadius: 1.5,
                    px: 1.5,
                    py: 0.5,
                    mb: 3,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: 1.2,
                      textTransform: "uppercase",
                    }}
                  >
                    Modern Healthcare Management
                  </Typography>
                </Box>
              </AnimatedBox>

              <AnimatedBox delay={0.15}>
                <Typography
                  variant="h2"
                  fontWeight={800}
                  color={MAROON_DARK}
                  sx={{
                    fontSize: { xs: "2.2rem", md: "3rem" },
                    lineHeight: 1.15,
                    mb: 3,
                  }}
                >
                  Streamline Your
                  <br />
                  Clinic Operations
                </Typography>
              </AnimatedBox>

              <AnimatedBox delay={0.3}>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#555",
                    lineHeight: 1.75,
                    mb: 4,
                    fontSize: "0.95rem",
                  }}
                >
                  A complete web-based system for small clinics and barangay
                  health centers. Manage patient registration, queues, and
                  consultations in a fast, organized, and digital way.
                </Typography>
              </AnimatedBox>

              <AnimatedBox delay={0.45}>
                <Button
                  component={Link}
                  to="/Register"
                  variant="outlined"
                  sx={{
                    color: MAROON_DARK,
                    borderColor: MAROON_DARK,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    px: 3,
                    py: 1,
                    fontSize: "0.9rem",
                    "&:hover": {
                      bgcolor: MAROON_DARK,
                      color: "white",
                    },
                  }}
                >
                  Get Started
                </Button>
              </AnimatedBox>
            </Box>

            {/* Right: Patient Queue card */}
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <AnimatedBox delay={0.55} sx={{ width: "100%", maxWidth: 520 }}>
                <Box
                  sx={{
                    bgcolor: MAROON,
                    borderRadius: 4,
                    p: { xs: 3, md: 4 },
                    boxShadow: `0 20px 60px rgba(102,0,19,0.35)`,
                    animation: `${float} 3.5s ease-in-out infinite`,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    color="white"
                    mb={2.5}
                    sx={{ fontSize: "1rem" }}
                  >
                    Patient Queue
                  </Typography>

                  <Stack spacing={2}>
                    {[
                      { num: 1, status: "Consulting" },
                      { num: 2, status: "Waiting" },
                      { num: 3, status: "Waiting" },
                    ].map((item, i) => (
                      <Paper
                        key={item.num}
                        elevation={0}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 2,
                          borderRadius: 3,
                          bgcolor: "rgba(255,255,255,0.97)",
                          animation: `${fadeIn} 0.4s ease-out ${i * 0.12}s both`,
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              bgcolor: "rgba(102,0,19,0.08)",
                              border: "1.5px solid rgba(102,0,19,0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              color: MAROON_DARK,
                              fontSize: "0.9rem",
                            }}
                          >
                            {item.num}
                          </Box>

                          <Box>
                            <Box
                              sx={{
                                width: 110,
                                height: 10,
                                bgcolor: "rgba(0,0,0,0.1)",
                                borderRadius: 2,
                                mb: 0.75,
                              }}
                            />
                            <Box
                              sx={{
                                width: 70,
                                height: 8,
                                bgcolor: "rgba(0,0,0,0.07)",
                                borderRadius: 2,
                              }}
                            />
                          </Box>
                        </Stack>

                        <Chip
                          label={item.status}
                          size="small"
                          sx={{
                            bgcolor: "rgba(102,0,19,0.08)",
                            color: MAROON_DARK,
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            border: "1px solid rgba(102,0,19,0.2)",
                            borderRadius: 1.5,
                          }}
                        />
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </AnimatedBox>
            </Box>
          </Box>
        </Container>

        <Box
          sx={{
            height: 180,
            background: `linear-gradient(to bottom, ${OFF_WHITE} 0%, ${MAROON_MID} 100%)`,
          }}
        />
      </Box>

      <Box sx={{ bgcolor: MAROON_DARK, height: 120 }} />

      {/* ── CTA Section ────────────────────────────────────────────────────── */}
      <Box
        id="cta"
        sx={{
          bgcolor: "#ffffff",
          py: { xs: 10, md: 14 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h3"
            fontWeight={800}
            color={MAROON_DARK}
            sx={{ fontSize: { xs: "1.9rem", md: "2.5rem" }, mb: 2.5 }}
          >
            Skip the Line. Join Us Online
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: "#666", lineHeight: 1.75, mb: 5, fontSize: "0.95rem" }}
          >
            Register yourself in the patient queue from the comfort of your
            home. No need to wait at the clinic – we'll notify you when it's
            your turn.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={handleOpenQueueModal}
            disabled={queueSubmitting}
            sx={{
              backgroundColor: MAROON_DARK,
              color: "white",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              py: 1.6,
              fontSize: "0.95rem",
              maxWidth: 480,
              "&:hover": { backgroundColor: MAROON },
              "&.Mui-disabled": { backgroundColor: MAROON, opacity: 0.6 },
            }}
          >
            {queueSubmitting ? "Submitting..." : "Join Queue Now"}
          </Button>

          <Typography
            variant="body2"
            sx={{ color: "#999", mt: 2.5, fontSize: "0.85rem" }}
          >
            You'll receive a queue number immediately after registration
          </Typography>
        </Container>
      </Box>

      <QueueModalForm
        open={queueModalOpen}
        onClose={handleCloseQueueModal}
        onSubmit={handleQueueSubmit}
        isSubmitting={queueSubmitting}
      />

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: MAROON_DARK, py: 5 }}>
        <Container maxWidth="lg">
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.5)", textAlign: "center" }}
          >
            © {new Date().getFullYear()} MediStream. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}