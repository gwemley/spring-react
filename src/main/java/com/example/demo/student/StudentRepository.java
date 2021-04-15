package com.example.demo.student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;


@Service
public interface StudentRepository extends JpaRepository<Student,Long> {

    @Query("SELECT COUNT(s) FROM Student s where s.email = ?1")
    int selectExistsEmail(String email);
}
