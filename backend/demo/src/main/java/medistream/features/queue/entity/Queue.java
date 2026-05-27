package medistream.features.queue.entity;

import jakarta.persistence.*;
import medistream.features.patient.entity.PatientEntity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "queue")
@JsonIgnoreProperties(value = {"hibernateLazyInitializer","handler"}, ignoreUnknown = true)
public class Queue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "queue_number")
    private String queueNumber;

    @Column(name = "status")
    private String status;

    @Column(name = "arrival_time")
    private String arrivalTime; 

    @Column(name = "assigned_doctor")
    private String assignedDoctor;

    // LINK TO PATIENT 
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "patient_id", referencedColumnName = "patient_id")
    @JsonIgnoreProperties({"consultations"})
    private PatientEntity patient;

    public Queue() {}

    public Queue(String queueNumber, String status, PatientEntity patient, String arrivalTime, String assignedDoctor) {
        this.queueNumber = queueNumber;
        this.status = status;
        this.patient = patient;
        this.arrivalTime = arrivalTime;
        this.assignedDoctor = assignedDoctor;
    }

    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }

    public String getAssignedDoctor() { return assignedDoctor; }
    public void setAssignedDoctor(String assignedDoctor) { this.assignedDoctor = assignedDoctor; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getQueueNumber() { return queueNumber; }
    public void setQueueNumber(String queueNumber) { this.queueNumber = queueNumber; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public PatientEntity getPatient() { return patient; }
    public void setPatient(PatientEntity patient) { this.patient = patient; }
}
