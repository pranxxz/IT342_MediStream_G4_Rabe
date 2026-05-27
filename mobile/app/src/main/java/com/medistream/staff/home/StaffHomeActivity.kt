package com.medistream.staff.home

import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import androidx.fragment.app.Fragment
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.medistream.R
import com.medistream.core.ui.BaseActivity
import com.medistream.databinding.ActivityStaffHomeBinding
import com.medistream.staff.consultations.ConsultationListFragment
import com.medistream.staff.medicalstaff.MedicalStaffListFragment
import com.medistream.staff.patients.PatientListFragment
import com.medistream.staff.profile.ProfileFragment
import com.medistream.staff.queue.QueueManagementFragment

class StaffHomeActivity : BaseActivity() {

    private lateinit var binding: ActivityStaffHomeBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityStaffHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)

        binding.bottomNavigationView.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.menu_queue -> {
                    binding.toolbar.title = "Queue Management"
                    replaceFragment(QueueManagementFragment())
                    true
                }
                R.id.menu_patients -> {
                    binding.toolbar.title = "Patients Directory"
                    replaceFragment(PatientListFragment())
                    true
                }
                R.id.menu_consultations -> {
                    binding.toolbar.title = "Consultations"
                    replaceFragment(ConsultationListFragment())
                    true
                }
                R.id.menu_staff -> {
                    binding.toolbar.title = "Medical Staff"
                    replaceFragment(MedicalStaffListFragment())
                    true
                }
                else -> false
            }
        }

        // Set default fragment
        if (savedInstanceState == null) {
            binding.bottomNavigationView.selectedItemId = R.id.menu_queue
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.toolbar_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return if (item.itemId == R.id.action_profile) {
            binding.toolbar.title = "My Profile"
            replaceFragment(ProfileFragment())
            true
        } else {
            super.onOptionsItemSelected(item)
        }
    }

    private fun replaceFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, fragment)
            .commit()
    }
}
