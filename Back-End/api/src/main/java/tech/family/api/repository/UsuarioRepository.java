package tech.family.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tech.family.api.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
}