package com.server.back.domain.user;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {


	public User findByUsername(String username);

	public User findByUserId(Long to_id);
}
