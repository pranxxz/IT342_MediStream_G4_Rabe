package medistream.features.medicalstaff.entity;

import jakarta.persistence.*;
import medistream.features.authentication.entity.UserAccountEntity;

@Entity
@Table(name = "medical_staff")
public class MedicalStaffEntity {

    @Id
    private int staffID;

    private String name;
    private String role;
    private String contactNo;
    private String specialty;
    private Integer age;
    private String gender;
    private String department;
    
    // NEW: Add availability field (NULL by default)
    @Column(length = 20)
    private String availability; // NULL by default

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "account_id", referencedColumnName = "accountID", unique = true)
    private UserAccountEntity userAccount;

    // Getters and Setters
    public int getStaffID() {
        return staffID;
    }

    public void setStaffID(int staffID) {
        this.staffID = staffID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getContactNo() {
        return contactNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    // NEW: Availability getter and setter
    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public UserAccountEntity getUserAccount() {
        return userAccount;
    }

    public void setUserAccount(UserAccountEntity userAccount) {
        this.userAccount = userAccount;
    }
}
