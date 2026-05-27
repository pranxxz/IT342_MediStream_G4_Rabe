package com.medistream.staff.profile

import android.content.Intent
import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.google.android.material.snackbar.Snackbar
import com.medistream.R
import com.medistream.core.MainActivity
import com.medistream.core.network.RetrofitClient
import com.medistream.core.network.TokenManager
import com.medistream.databinding.FragmentProfileBinding
import kotlinx.coroutines.launch

class ProfileFragment : Fragment() {

    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!

    private var currentProfile: StaffProfileResponse? = null
    private val statusOptions = arrayOf("available", "busy", "offline")
    private val genderOptions = arrayOf("Male", "Female", "Other", "Prefer not to say")

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val context = requireContext()
        val name = TokenManager.getUserName(context)?.takeIf { it.isNotBlank() } ?: "Staff Member"
        val role = TokenManager.getUserRole(context) ?: "STAFF"
        val id = TokenManager.getUserId(context)
        val email = TokenManager.getEmail(context)?.takeIf { it.isNotBlank() } ?: "No email listed"

        // Set initial values
        binding.tvProfileName.text = name
        binding.tvProfileRole.text = role.uppercase()
        binding.tvProfileStaffId.text = "#$id"
        binding.tvProfileEmail.text = email
        binding.etProfileNameEdit.setText(if (name == "Staff Member") "" else name)

        setupSpinners()

        binding.btnLogout.setOnClickListener {
            TokenManager.clear(context)
            val intent = Intent(requireActivity(), MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }
            startActivity(intent)
            requireActivity().finish()
        }

        binding.btnSaveContact.setOnClickListener {
            saveContactDetails()
        }

        fetchProfileDetails(id)
    }

    private fun setupSpinners() {
        val availabilityAdapter = ArrayAdapter(
            requireContext(),
            android.R.layout.simple_spinner_item,
            statusOptions.map { it.uppercase() }
        )
        availabilityAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.spinnerAvailability.adapter = availabilityAdapter

        val genderAdapter = ArrayAdapter(
            requireContext(),
            android.R.layout.simple_spinner_item,
            genderOptions
        )
        genderAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.spinnerGenderEdit.adapter = genderAdapter
    }

    private fun fetchProfileDetails(staffId: Int) {
        if (staffId == 0) return

        lifecycleScope.launch {
            try {
                val service = RetrofitClient.authInstance.create(ProfileService::class.java)
                val response = service.getStaffProfile(staffId)
                if (response.isSuccessful) {
                    val profile = response.body()
                    currentProfile = profile
                    if (profile != null) {
                        val displayName = profile.name.takeIf { it.isNotBlank() } ?: "Staff Member"
                        binding.tvProfileName.text = displayName
                        binding.tvProfileRole.text = profile.role.uppercase()
                        binding.tvProfileStaffId.text = "#$staffId"
                        
                        val cachedEmail = TokenManager.getEmail(requireContext()) ?: "No email listed"
                        binding.tvProfileEmail.text = cachedEmail
                        
                        binding.tvProfileSpecialty.text = profile.specialty?.takeIf { it.isNotBlank() } ?: "General Practice"
                        binding.tvProfileDepartment.text = profile.department?.takeIf { it.isNotBlank() } ?: "General Medicine"
                        
                        val ageText = if (profile.age != null) "${profile.age} yrs" else "Age N/A"
                        val genderText = profile.gender?.takeIf { it.isNotBlank() } ?: "Gender N/A"
                        binding.tvProfileAgeGender.text = "$ageText, $genderText"
                        
                        // Set text edits
                        binding.etProfileNameEdit.setText(profile.name ?: "")
                        binding.etProfileSpecialtyEdit.setText(profile.specialty ?: "")
                        binding.etProfileDepartmentEdit.setText(profile.department ?: "")
                        binding.etProfileAgeEdit.setText(profile.age?.toString() ?: "")
                        binding.etProfileContact.setText(profile.contactNo ?: "")

                        val genderIndex = genderOptions.indexOfFirst { it.equals(profile.gender, ignoreCase = true) }
                        if (genderIndex >= 0) {
                            binding.spinnerGenderEdit.setSelection(genderIndex)
                        } else {
                            binding.spinnerGenderEdit.setSelection(0)
                        }

                        val currentStatus = profile.availability?.lowercase() ?: "available"
                        val index = statusOptions.indexOf(currentStatus)
                        if (index >= 0) {
                            binding.spinnerAvailability.setSelection(index)
                        }
                        updateAvailabilityBadge(currentStatus)

                        // Sync the fetched name back into TokenManager so the
                        // cached session always reflects the real backend data
                        TokenManager.saveUser(
                            requireContext(),
                            staffId,
                            profile.role,
                            displayName
                        )
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun updateAvailabilityBadge(status: String) {
        binding.tvProfileAvailabilityBadge.text = status.uppercase()
        when (status.lowercase()) {
            "available" -> {
                binding.tvProfileAvailabilityBadge.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#388E3C"))
            }
            "busy" -> {
                binding.tvProfileAvailabilityBadge.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FFA000"))
            }
            "offline" -> {
                binding.tvProfileAvailabilityBadge.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#D32F2F"))
            }
        }
    }

    private fun saveContactDetails() {
        val staffId = TokenManager.getUserId(requireContext())
        if (staffId == 0 || currentProfile == null) {
            showSnackbar("Unable to update: Profile details not loaded.", isError = true)
            return
        }

        val name = binding.etProfileNameEdit.text.toString().trim()
        val specialty = binding.etProfileSpecialtyEdit.text.toString().trim()
        val department = binding.etProfileDepartmentEdit.text.toString().trim()
        val ageStr = binding.etProfileAgeEdit.text.toString().trim()
        val gender = genderOptions[binding.spinnerGenderEdit.selectedItemPosition]
        val contact = binding.etProfileContact.text.toString().trim()
        val selectedStatus = statusOptions[binding.spinnerAvailability.selectedItemPosition]

        // Input Validations
        if (name.isEmpty()) {
            showSnackbar("Name cannot be empty.", isError = true)
            return
        }

        val age = if (ageStr.isNotEmpty()) {
            val parsedAge = ageStr.toIntOrNull()
            if (parsedAge == null || parsedAge < 18 || parsedAge > 120) {
                showSnackbar("Age must be a valid number between 18 and 120.", isError = true)
                return
            }
            parsedAge
        } else {
            null
        }

        lifecycleScope.launch {
            try {
                val service = RetrofitClient.authInstance.create(ProfileService::class.java)
                val request = currentProfile!!.copy(
                    name = name,
                    specialty = specialty.ifEmpty { null },
                    department = department.ifEmpty { null },
                    age = age,
                    gender = gender,
                    contactNo = contact.ifEmpty { null },
                    availability = selectedStatus
                )
                val response = service.updateStaffProfile(staffId, request)

                if (response.isSuccessful) {
                    val updated = response.body()
                    currentProfile = updated
                    if (updated != null) {
                        // Sync static displays on screen
                        binding.tvProfileName.text = updated.name
                        binding.tvProfileSpecialty.text = updated.specialty ?: "General Practice"
                        binding.tvProfileDepartment.text = updated.department ?: "General Medicine"
                        
                        val ageText = if (updated.age != null) "${updated.age} yrs" else "Age N/A"
                        val genderText = updated.gender ?: "Gender N/A"
                        binding.tvProfileAgeGender.text = "$ageText, $genderText"
                        
                        updateAvailabilityBadge(updated.availability ?: selectedStatus)
                        
                        // Sync saved user name in TokenManager so it is preserved on dashboard/session
                        TokenManager.saveUser(
                            requireContext(),
                            staffId,
                            updated.role,
                            updated.name
                        )
                    }
                    showSnackbar("Profile updated successfully!")
                } else {
                    showSnackbar("Failed to update profile: ${response.message()}", isError = true)
                }
            } catch (e: Exception) {
                showSnackbar("Error updating profile: ${e.localizedMessage}", isError = true)
            }
        }
    }


    private fun showSnackbar(message: String, isError: Boolean = false) {
        (activity as? com.medistream.core.ui.BaseActivity)?.showSnackbar(message, isError)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
