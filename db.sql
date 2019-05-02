-- MySQL Script generated by MySQL Workbench
-- Fri Apr 19 20:05:15 2019
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`utente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`utente` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `Nome` VARCHAR(45) NOT NULL,
  `Cognome` VARCHAR(45) NOT NULL,
  `DataNascita` DATE NULL DEFAULT NULL,
  `Professione` VARCHAR(45) NULL DEFAULT NULL,
  `Email` VARCHAR(45) NOT NULL,
  `Password` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 23
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mydb`.`jobs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`jobs` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `Titolo` VARCHAR(30) NULL DEFAULT NULL COMMENT '		',
  `Luogo` VARCHAR(100) NULL DEFAULT NULL,
  `Informazioni` VARCHAR(1000) NULL DEFAULT NULL,
  `Creatore` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_BANDO_UTENTE1_idx` (`Creatore` ASC) VISIBLE,
  CONSTRAINT `fk_BANDO_UTENTE1`
    FOREIGN KEY (`Creatore`)
    REFERENCES `mydb`.`utente` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 16
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mydb`.`appliers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`appliers` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `idUtente` INT(11) NOT NULL,
  `idJob` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `utente_idx` (`idUtente` ASC) VISIBLE,
  INDEX `job_idx` (`idJob` ASC) VISIBLE,
  CONSTRAINT `job`
    FOREIGN KEY (`idJob`)
    REFERENCES `mydb`.`jobs` (`id`),
  CONSTRAINT `utente`
    FOREIGN KEY (`idUtente`)
    REFERENCES `mydb`.`utente` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 19
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mydb`.`certificazione`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`certificazione` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `Categoria` VARCHAR(45) NULL DEFAULT NULL,
  `Nome` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mydb`.`certificato utente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`certificato utente` (
  `CERTIFICAZIONE_id` INT(11) NOT NULL,
  `UTENTE_id` INT(11) NOT NULL,
  PRIMARY KEY (`CERTIFICAZIONE_id`, `UTENTE_id`),
  INDEX `fk_CERTIFICAZIONE_has_UTENTE_UTENTE1_idx` (`UTENTE_id` ASC) VISIBLE,
  INDEX `fk_CERTIFICAZIONE_has_UTENTE_CERTIFICAZIONE1_idx` (`CERTIFICAZIONE_id` ASC) VISIBLE,
  CONSTRAINT `fk_CERTIFICAZIONE_has_UTENTE_CERTIFICAZIONE1`
    FOREIGN KEY (`CERTIFICAZIONE_id`)
    REFERENCES `mydb`.`certificazione` (`id`),
  CONSTRAINT `fk_CERTIFICAZIONE_has_UTENTE_UTENTE1`
    FOREIGN KEY (`UTENTE_id`)
    REFERENCES `mydb`.`utente` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mydb`.`collegamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`collegamento` (
  `Userone` INT(11) NOT NULL,
  `Usertwo` INT(11) NOT NULL,
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  INDEX `fk_UTENTE_has_UTENTE_UTENTE2_idx` (`Usertwo` ASC) VISIBLE,
  INDEX `fk_UTENTE_has_UTENTE_UTENTE1_idx` (`Userone` ASC) VISIBLE,
  CONSTRAINT `fk_UTENTE_has_UTENTE_UTENTE1`
    FOREIGN KEY (`Userone`)
    REFERENCES `mydb`.`utente` (`id`),
  CONSTRAINT `fk_UTENTE_has_UTENTE_UTENTE2`
    FOREIGN KEY (`Usertwo`)
    REFERENCES `mydb`.`utente` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 18
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mydb`.`skills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`skills` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `Nome` VARCHAR(45) CHARACTER SET 'big5' NOT NULL,
  `Categoria` VARCHAR(45) NULL DEFAULT NULL,
  `idUTENTE` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`, `Nome`),
  INDEX `id_idx` (`idUTENTE` ASC) VISIBLE,
  CONSTRAINT `id`
    FOREIGN KEY (`idUTENTE`)
    REFERENCES `mydb`.`utente` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mydb`.`cvskill`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`cvskill` (
  `SKILL_id` INT(11) NOT NULL,
  `SKILL_Nome` VARCHAR(45) CHARACTER SET 'big5' NOT NULL,
  `UTENTE_id` INT(11) NOT NULL,
  PRIMARY KEY (`SKILL_id`, `SKILL_Nome`, `UTENTE_id`),
  INDEX `fk_SKILL_has_UTENTE_UTENTE1_idx` (`UTENTE_id` ASC) VISIBLE,
  INDEX `fk_SKILL_has_UTENTE_SKILL1_idx` (`SKILL_id` ASC, `SKILL_Nome` ASC) VISIBLE,
  CONSTRAINT `fk_SKILL_has_UTENTE_SKILL1`
    FOREIGN KEY (`SKILL_id` , `SKILL_Nome`)
    REFERENCES `mydb`.`skills` (`id` , `Nome`),
  CONSTRAINT `fk_SKILL_has_UTENTE_UTENTE1`
    FOREIGN KEY (`UTENTE_id`)
    REFERENCES `mydb`.`utente` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mydb`.`messaggio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`messaggio` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `Testo` VARCHAR(500) NULL DEFAULT NULL,
  `MITTENTE_id` INT(11) NOT NULL,
  `Data` VARCHAR(45) NULL DEFAULT NULL,
  `COLLEGAMENTO_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`, `MITTENTE_id`),
  INDEX `fk_MESSAGGIO_UTENTE1_idx` (`MITTENTE_id` ASC) VISIBLE,
  INDEX `fk_MESSAGGIO_COLLEGAMENTO1_idx` (`COLLEGAMENTO_id` ASC) VISIBLE,
  CONSTRAINT `fk_MESSAGGIO_COLLEGAMENTO1`
    FOREIGN KEY (`COLLEGAMENTO_id`)
    REFERENCES `mydb`.`collegamento` (`id`),
  CONSTRAINT `fk_MESSAGGIO_UTENTE1`
    FOREIGN KEY (`MITTENTE_id`)
    REFERENCES `mydb`.`utente` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 45
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mydb`.`partecipanti`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`partecipanti` (
  `UTENTE_id` INT(11) NOT NULL,
  `BANDO_id` INT(11) NOT NULL,
  PRIMARY KEY (`UTENTE_id`, `BANDO_id`),
  INDEX `fk_UTENTE_has_BANDO_BANDO1_idx` (`BANDO_id` ASC) VISIBLE,
  INDEX `fk_UTENTE_has_BANDO_UTENTE1_idx` (`UTENTE_id` ASC) VISIBLE,
  CONSTRAINT `fk_UTENTE_has_BANDO_BANDO1`
    FOREIGN KEY (`BANDO_id`)
    REFERENCES `mydb`.`bando` (`id`),
  CONSTRAINT `fk_UTENTE_has_BANDO_UTENTE1`
    FOREIGN KEY (`UTENTE_id`)
    REFERENCES `mydb`.`utente` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mydb`.`userdata`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`userdata` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `Azienda` VARCHAR(45) NULL DEFAULT NULL,
  `UTENTE_id` INT(11) NOT NULL,
  `Facolta` VARCHAR(45) NULL DEFAULT NULL,
  `Lavoro` VARCHAR(45) NULL DEFAULT NULL,
  `Descrizione` VARCHAR(500) NULL DEFAULT NULL,
  PRIMARY KEY (`id`, `UTENTE_id`),
  INDEX `fk_USERDATA_UTENTE1_idx` (`UTENTE_id` ASC) VISIBLE,
  CONSTRAINT `fk_USERDATA_UTENTE1`
    FOREIGN KEY (`UTENTE_id`)
    REFERENCES `mydb`.`utente` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
