package medistream.repository;

import medistream.entity.ConsultationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<ConsultationEntity, Integer> {
	// Find consultations by patient id ordered by consultation datetime desc
	List<ConsultationEntity> findByPatient_PatientIdOrderByConsultationDateTimeDesc(int patientId);
}
