package medistream.features.patientqueue.service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import medistream.features.patientqueue.dto.request.PatientQueueRequest;
import medistream.features.patientqueue.entity.Queue;
import medistream.features.patientqueue.repository.QueueRepository;
import medistream.shared.entity.PatientEntity;
import medistream.shared.repository.PatientRepository;

@Service
public class QueueService {

    @Autowired
    private QueueRepository queueRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Transactional
    public Queue joinQueue(PatientQueueRequest request) {
        
        // 1. Create and Save Patient
        PatientEntity patient = new PatientEntity();
        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setAge(request.getAge());
        patient.setGender(request.getGender());
        patient.setContactNumber(request.getContactNumber());
        patient.setAddress(request.getAddress());
        patient.setFullName(request.getFirstName() + " " + request.getLastName());

        // Save patient first
        patient = patientRepository.save(patient);

        // 2. Generate Queue Number
        String nextQueueNumber = generateNextQueueNumber();

        // 3. Create Queue Entry
        Queue queue = new Queue();
        queue.setQueueNumber(nextQueueNumber);
        queue.setStatus("WAITING");
        queue.setPatient(patient);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a");
        queue.setArrivalTime(LocalTime.now().format(formatter));
        queue.setAssignedDoctor("Unassigned");

        // 4. Save and Return
        return queueRepository.save(queue);
    }

    private String generateNextQueueNumber() {
        return queueRepository.findLastQueueEntry()
                .map(lastQueue -> {
                    String lastNumStr = lastQueue.getQueueNumber();
                    int lastNum = Integer.parseInt(lastNumStr.split("-")[1]);
                    return String.format("Q-%03d", lastNum + 1);
                })
                .orElse("Q-001");
    }

    public List<Queue> getAllQueues() {
        return queueRepository.findAll();
    }

    @Transactional
    public Queue updateQueue(Long id, Queue queueData) throws Exception {
        Queue queue = queueRepository.findById(id)
            .orElseThrow(() -> new Exception("Queue item not found with id: " + id));

        // Update queue fields
        if (queueData.getStatus() != null) {
            queue.setStatus(queueData.getStatus());
        }
        if (queueData.getAssignedDoctor() != null) {
            queue.setAssignedDoctor(queueData.getAssignedDoctor());
        }

        // Update patient details if provided
        if (queueData.getPatient() != null) {
            PatientEntity patient = queue.getPatient();
            if (queueData.getPatient().getFirstName() != null) {
                patient.setFirstName(queueData.getPatient().getFirstName());
            }
            if (queueData.getPatient().getLastName() != null) {
                patient.setLastName(queueData.getPatient().getLastName());
            }
            if (queueData.getPatient().getAge() > 0) {
                patient.setAge(queueData.getPatient().getAge());
            }
            patientRepository.save(patient);
        }

        return queueRepository.save(queue);
    }

    @Transactional
    public void deleteQueue(Long id) throws Exception {
        queueRepository.findById(id)
            .orElseThrow(() -> new Exception("Queue item not found with id: " + id));

        queueRepository.deleteById(id);
    }
}
