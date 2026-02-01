package com.ironlady.leaderops.service;

import com.ironlady.leaderops.model.Applicant;
import com.ironlady.leaderops.repository.ApplicantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ApplicantService {

    @Autowired
    private ApplicantRepository repository;

    public List<Applicant> getAllApplicants() {
        return repository.findAll();
    }

    public Applicant addApplicant(Applicant applicant) {
        applicant.setDate(LocalDate.now().toString());
        return repository.save(applicant);
    }

    public Applicant updateApplicant(Long id, Applicant updatedDetails) {
        return repository.findById(id).map(applicant -> {
            applicant.setName(updatedDetails.getName());
            applicant.setProgram(updatedDetails.getProgram());
            applicant.setEmail(updatedDetails.getEmail());
            applicant.setStatus(updatedDetails.getStatus());
            // Date remains original
            return repository.save(applicant);
        }).orElse(null);
    }

    public void deleteApplicant(Long id) {
        repository.deleteById(id);
    }
}
