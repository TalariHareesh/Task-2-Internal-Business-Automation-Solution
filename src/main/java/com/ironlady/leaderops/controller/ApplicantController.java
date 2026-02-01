package com.ironlady.leaderops.controller;

import com.ironlady.leaderops.model.Applicant;
import com.ironlady.leaderops.service.ApplicantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applicants")
@CrossOrigin(origins = "*") 
public class ApplicantController {

    @Autowired
    private ApplicantService service;

    // READ
    @GetMapping
    public List<Applicant> getAllApplicants() {
        return service.getAllApplicants();
    }

    // CREATE
    @PostMapping
    public Applicant addApplicant(@RequestBody Applicant applicant) {
        return service.addApplicant(applicant);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Applicant updateApplicant(@PathVariable Long id, @RequestBody Applicant updatedDetails) {
        return service.updateApplicant(id, updatedDetails);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteApplicant(@PathVariable Long id) {
        service.deleteApplicant(id);
        return "Deleted";
    }
}
