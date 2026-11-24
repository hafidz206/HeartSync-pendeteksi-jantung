-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 24, 2026 at 01:17 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.36

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `heartsync_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `hasil_kuesioner`
--

CREATE TABLE `hasil_kuesioner` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jawaban_json` longtext COLLATE utf8mb4_unicode_ci,
  `skor` int DEFAULT NULL,
  `score` int DEFAULT NULL,
  `tingkat_risiko` enum('rendah','sedang','tinggi','terdiagnosa') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `result_text` text COLLATE utf8mb4_unicode_ci,
  `persentase` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hasil_kuesioner`
--

INSERT INTO `hasil_kuesioner` (`id`, `user_id`, `email`, `jawaban_json`, `skor`, `score`, `tingkat_risiko`, `result_text`, `persentase`, `created_at`) VALUES
(4, 19, 'nadia.putri@gmail.com', NULL, 20, 20, 'rendah', NULL, 20, '2026-10-02 04:30:00'),
(5, 20, 'ahmad.fauzi@gmail.com', NULL, 75, 75, 'tinggi', NULL, 75, '2026-10-01 07:20:00'),
(6, 21, 'siti.aisyah@gmail.com', NULL, 15, 15, 'rendah', NULL, 15, '2026-10-01 09:45:00'),
(8, 22, 'hafidz@gmail.com', NULL, 8, 8, 'sedang', 'sedang', NULL, '2026-11-14 12:50:37'),
(9, 23, 'hafidz@heartsync.com', NULL, 9, 9, 'sedang', 'sedang', NULL, '2026-11-14 14:41:44');

-- --------------------------------------------------------

--
-- Table structure for table `pengukuran`
--

CREATE TABLE `pengukuran` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detak_jantung` int DEFAULT NULL,
  `heart_rate` int DEFAULT NULL,
  `tekanan_darah` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gula_darah` int DEFAULT NULL,
  `berat_badan` decimal(5,2) DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `nama` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `custom_email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `verification_code` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `custom_email`, `role`, `password`, `created_at`, `verification_code`, `is_verified`) VALUES
(19, 'Nadia Putri', 'nadia.putri@gmail.com', NULL, 'user', '$2y$10$yaqg7rA1.TI8GlMJCDfnjeb4WsKD0Pj2ACHfqAVg3FiIZbVGQqjaK', '2026-10-02 04:30:00', NULL, 1),
(20, 'Ahmad Fauzi', 'ahmad.fauzi@gmail.com', NULL, 'user', '$2y$10$a/OmzDPnz9ckQ.V1cItcKeLfTBcMoptvlvH89LF8LleI1yMeyjvAG', '2026-10-01 07:20:00', NULL, 1),
(21, 'Siti Aisyah', 'siti.aisyah@gmail.com', NULL, 'user', '$2y$10$1TYpvLXbQcsHzKS8ohKOG..bTIdp7rY4bk7lSN.jngfauh0mISofu', '2026-10-01 09:45:00', NULL, 1),
(22, 'hafidz', 'hafidz@gmail.com', NULL, 'user', '$2y$10$t/msre/xFwANJ7y7cb1xnulMgaSeObHOol.4.rwTKOPmah6yMoq32', '2026-11-14 12:50:10', NULL, 1),
(23, 'hafidz', 'hafidz@heartsync.com', NULL, 'admin', '$2y$10$hmdXYguu/9MtggiV/A2CBOEun7/tbyX19K36jaGa3Qi.m57Ph6nJi', '2026-11-14 14:41:12', NULL, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `hasil_kuesioner`
--
ALTER TABLE `hasil_kuesioner`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_hasil_user` (`user_id`);

--
-- Indexes for table `pengukuran`
--
ALTER TABLE `pengukuran`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pengukuran_user` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `custom_email` (`custom_email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `hasil_kuesioner`
--
ALTER TABLE `hasil_kuesioner`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `pengukuran`
--
ALTER TABLE `pengukuran`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `hasil_kuesioner`
--
ALTER TABLE `hasil_kuesioner`
  ADD CONSTRAINT `fk_hasil_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pengukuran`
--
ALTER TABLE `pengukuran`
  ADD CONSTRAINT `fk_pengukuran_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
