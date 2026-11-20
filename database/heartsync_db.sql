-- MySQL dump 10.13  Distrib 8.4.3, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: heartsync_db
-- ------------------------------------------------------
-- Server version	8.4.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `heartsync_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `heartsync_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `heartsync_db`;

--
-- Table structure for table `hasil_kuesioner`
--

DROP TABLE IF EXISTS `hasil_kuesioner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hasil_kuesioner` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jawaban_json` longtext COLLATE utf8mb4_unicode_ci,
  `skor` int DEFAULT NULL,
  `score` int DEFAULT NULL,
  `tingkat_risiko` enum('rendah','sedang','tinggi','terdiagnosa') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `result_text` text COLLATE utf8mb4_unicode_ci,
  `persentase` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_hasil_user` (`user_id`),
  CONSTRAINT `fk_hasil_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hasil_kuesioner`
--

LOCK TABLES `hasil_kuesioner` WRITE;
/*!40000 ALTER TABLE `hasil_kuesioner` DISABLE KEYS */;
INSERT INTO `hasil_kuesioner` VALUES (4,19,'nadia.putri@gmail.com',NULL,20,20,'rendah',NULL,20,'2026-10-02 04:30:00'),(5,20,'ahmad.fauzi@gmail.com',NULL,75,75,'tinggi',NULL,75,'2026-10-01 07:20:00'),(6,21,'siti.aisyah@gmail.com',NULL,15,15,'rendah',NULL,15,'2026-10-01 09:45:00'),(8,22,'hafidz@gmail.com',NULL,8,8,'sedang','sedang',NULL,'2026-11-14 12:50:37'),(9,23,'hafidz@heartsync.com',NULL,9,9,'sedang','sedang',NULL,'2026-11-14 14:41:44');
/*!40000 ALTER TABLE `hasil_kuesioner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pengukuran`
--

DROP TABLE IF EXISTS `pengukuran`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pengukuran` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detak_jantung` int DEFAULT NULL,
  `heart_rate` int DEFAULT NULL,
  `tekanan_darah` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gula_darah` int DEFAULT NULL,
  `berat_badan` decimal(5,2) DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_pengukuran_user` (`user_id`),
  CONSTRAINT `fk_pengukuran_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pengukuran`
--

LOCK TABLES `pengukuran` WRITE;
/*!40000 ALTER TABLE `pengukuran` DISABLE KEYS */;
/*!40000 ALTER TABLE `pengukuran` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `custom_email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `verification_code` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `custom_email` (`custom_email`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (19,'Nadia Putri','nadia.putri@gmail.com',NULL,'user','$2y$10$yaqg7rA1.TI8GlMJCDfnjeb4WsKD0Pj2ACHfqAVg3FiIZbVGQqjaK','2026-10-02 04:30:00',NULL,1),(20,'Ahmad Fauzi','ahmad.fauzi@gmail.com',NULL,'user','$2y$10$a/OmzDPnz9ckQ.V1cItcKeLfTBcMoptvlvH89LF8LleI1yMeyjvAG','2026-10-01 07:20:00',NULL,1),(21,'Siti Aisyah','siti.aisyah@gmail.com',NULL,'user','$2y$10$1TYpvLXbQcsHzKS8ohKOG..bTIdp7rY4bk7lSN.jngfauh0mISofu','2026-10-01 09:45:00',NULL,1),(22,'hafidz','hafidz@gmail.com',NULL,'user','$2y$10$t/msre/xFwANJ7y7cb1xnulMgaSeObHOol.4.rwTKOPmah6yMoq32','2026-11-14 12:50:10',NULL,1),(23,'hafidz','hafidz@heartsync.com',NULL,'admin','$2y$10$hmdXYguu/9MtggiV/A2CBOEun7/tbyX19K36jaGa3Qi.m57Ph6nJi','2026-11-14 14:41:12',NULL,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-20 23:10:18
