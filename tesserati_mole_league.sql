-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Dic 29, 2021 alle 21:51
-- Versione del server: 10.4.21-MariaDB
-- Versione PHP: 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tesserati_mole_league`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `amministratori`
--

CREATE TABLE `amministratori` (
  `id` int(11) NOT NULL,
  `mail` varchar(254) NOT NULL,
  `psw` varchar(255) NOT NULL,
  `id_squadra` int(11) NOT NULL COMMENT 'collegamento a squadre',
  `id_stagione` int(11) NOT NULL COMMENT 'collegamento a stagioni'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `amministratori`
--

INSERT INTO `amministratori` (`id`, `mail`, `psw`, `id_squadra`, `id_stagione`) VALUES
(1, 'prova@mail.com', '$2y$10$EghkNgkk3rXXv4esyl4uDON0fGZXZiughETNaJiovmQ4drGws6ABq', 1, 1),
(3, 'prova2@mail.com', '$2y$10$LG8kfHd2FEaNm2Vsi7B2uuYdYl9sEvqHd4bAGCo0VdgPeXbIwFfBq', 1, 1);

-- --------------------------------------------------------

--
-- Struttura della tabella `certificati_med`
--

CREATE TABLE `certificati_med` (
  `id` int(11) NOT NULL,
  `scadenza` date NOT NULL,
  `file` varchar(256) DEFAULT NULL,
  `fisico` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'cert fisico 1 cert online 0',
  `id_giocatore` int(11) NOT NULL COMMENT 'collegamento a giocatori',
  `data_caricamento` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `certificati_med`
--

INSERT INTO `certificati_med` (`id`, `scadenza`, `file`, `fisico`, `id_giocatore`, `data_caricamento`) VALUES
(1, '2021-11-30', NULL, 0, 1, '2021-12-01'),
(2, '2021-12-10', NULL, 1, 2, '2021-12-01'),
(4, '2022-06-20', NULL, 1, 1, '2021-12-01'),
(7, '2022-05-12', 'C:\\Users\\marco\\Documents\\sitoTesseramentiMolecup\\api\\uploads\\certificati\\ 2020-2021_Alfieri_Magnanini_Marco_MGNMRC01D16F335P_2022-05-12_1.jpeg', 0, 30, '2021-12-04'),
(8, '2023-09-12', 'C:\\Users\\marco\\Documents\\sitoTesseramentiMolecup\\api\\uploads\\certificati\\ 2020-2021_Alfieri_Magnanini_Marco_MGNMRC01D16F335P_2023-09-12_1.jpg', 0, 31, '2021-12-04'),
(9, '2023-01-12', 'C:\\Users\\marco\\Documents\\sitoTesseramentiMolecup\\api\\uploads\\certificati\\2020-2021_Alfieri_Magnanini_Marco_MGNMRC01D16F335P_2023-01-12_1.pdf', 0, 36, '2021-12-04'),
(10, '2022-05-12', 'C:\\Users\\marco\\Documents\\sitoTesseramentiMolecup\\api\\uploads\\certificati\\2020-2021_Alfieri_Ciao_Luciano_MGNMRC01D16F335P_2022-05-12_1.jpeg', 0, 38, '2021-12-06'),
(11, '2023-12-12', 'C:\\Users\\marco\\Documents\\sitoTesseramentiMolecup\\api\\uploads\\certificati\\2020-2021_Alfieri_Bros_Mario_MGNMRC01D16F335P_2023-12-12_1.jpg', 0, 39, '2021-12-06'),
(12, '2023-05-12', 'C:\\Users\\marco\\Documents\\sitoTesseramentiMolecup\\api\\uploads\\certificati\\2020-2021_Alfieri_Llluigi_Luigi_MGNMRC01D16F335P_2023-05-12_1.jpg', 0, 40, '2021-12-06'),
(13, '2022-02-25', 'C:\\Users\\marco\\Documents\\sitoTesseramentiMolecup\\api\\uploads\\certificati\\2020-2021_Alfieri_Magnanini_Marco_MGNMRC01D16F335P_2022-02-25_1.jpg', 0, 41, '2021-12-07'),
(14, '2023-12-12', 'C:\\Users\\marco\\Documents\\sitoTesseramentiMolecup\\api\\uploads\\certificati\\2020-2021_Alfieri_Cassio_Bruto_MGNMRC01D16F335P_2023-12-12_1.jpg', 0, 48, '2021-12-08'),
(15, '2023-05-12', 'C:\\Users\\marco\\Documents\\sitoTesseramentiMolecup\\api\\uploads\\certificati\\2020-2021_Alfieri_Cesare_Giulio_MGNMRC01D16F335P_2023-05-12_1.jpg', 0, 49, '2021-12-08'),
(16, '2023-02-12', 'C:\\Users\\marco\\Documents\\sitoTesseramentiMolecup\\api\\uploads\\certificati\\2020-2021_Alfieri_Cretino_Pierino_ggbvcx03f54i334p_2023-02-12_1.jpg', 0, 3, '2021-12-09'),
(17, '2022-05-15', 'C:\\Users\\marco\\Documents\\sitoTesseramentiMolecup\\api\\uploads\\certificati\\2020-2021_Alfieri_Ross_Mario_MGNMRC01D16F335P_2022-05-15_1.jpg', 0, 10, '2021-12-09'),
(18, '2022-05-12', '', 0, 50, '2021-12-28'),
(19, '2023-08-25', '', 0, 51, '2021-12-28'),
(20, '2023-05-12', '', 0, 52, '2021-12-29');

-- --------------------------------------------------------

--
-- Struttura della tabella `codici_ripristino`
--

CREATE TABLE `codici_ripristino` (
  `id_amministratore` int(11) NOT NULL,
  `token` varchar(256) NOT NULL,
  `data_scadenza` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `dirigenti`
--

CREATE TABLE `dirigenti` (
  `id` int(11) NOT NULL,
  `cf` varchar(16) NOT NULL,
  `nome` text NOT NULL,
  `cognome` text NOT NULL,
  `id_squadra` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `dirigenti`
--

INSERT INTO `dirigenti` (`id`, `cf`, `nome`, `cognome`, `id_squadra`) VALUES
(1, 'mnbvcx03f54i334p', 'Maurizio', 'Sarri', 1),
(3, 'MGNMRC01D16F335P', 'Luca', 'Allenatore', 1),
(4, 'MGNMRC01D16F335P', 'Luca', 'Ciao', 1),
(5, 'MGNMRC01D16F335P', 'Virgilio', 'Verdi', 1),
(6, 'MGNMRC01D16F335P', 'Marco', 'Magnanini', 1),
(7, 'MGNMRC01D16F335P', 'Luca', 'All', 1);

-- --------------------------------------------------------

--
-- Struttura della tabella `d_tesserati`
--

CREATE TABLE `d_tesserati` (
  `id_stagione` int(11) NOT NULL COMMENT 'collegamento a stagioni',
  `id_giocatore` int(11) NOT NULL COMMENT 'collegamento a giocatori'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `d_tesserati`
--

INSERT INTO `d_tesserati` (`id_stagione`, `id_giocatore`) VALUES
(1, 3),
(1, 5);

-- --------------------------------------------------------

--
-- Struttura della tabella `elenchi_inviati`
--

CREATE TABLE `elenchi_inviati` (
  `id_squadra` int(11) NOT NULL,
  `id_stagione` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `giocatori`
--

CREATE TABLE `giocatori` (
  `id` int(11) NOT NULL,
  `cf` varchar(16) NOT NULL,
  `nome` text NOT NULL,
  `cognome` text NOT NULL,
  `classe` varchar(8) NOT NULL,
  `data_nascita` date NOT NULL,
  `luogo_nascita` text DEFAULT NULL,
  `ruolo` varchar(32) DEFAULT NULL,
  `taglia` varchar(4) DEFAULT NULL,
  `numero_maglia` int(2) DEFAULT NULL,
  `id_squadra` int(11) NOT NULL COMMENT 'collegamento a squadre'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `giocatori`
--

INSERT INTO `giocatori` (`id`, `cf`, `nome`, `cognome`, `classe`, `data_nascita`, `luogo_nascita`, `ruolo`, `taglia`, `numero_maglia`, `id_squadra`) VALUES
(1, 'mnbvcx03f54i334p', 'pippo', 'baudo', '4a', '2004-10-05', 'Pinerolo', 'Att', 'M', 10, 1),
(2, 'mnbvcx03f54i334h', 'Pluto', 'Cane', '4a', '2003-11-04', 'Volpiano', 'Att', 'M', 12, 1),
(3, 'ggbvcx03f54i334p', 'Pierino', 'Cretino', '2B', '2006-10-05', 'Nichelino', 'Dif', 'S', 52, 1),
(10, 'MGNMRC01D16F335P', 'Mario', 'Ross', '3D', '2002-04-12', 'Torino', 'Por', 'S', 2, 1),
(12, 'MGNMRC01D16F335P', 'Mario', 'Rossi', '5F', '2004-04-12', 'Moncalieri', 'Cen', 'S', 18, 1),
(13, 'MGNMRC01D16F335P', 'Luca', 'Mancini', '3B', '2003-05-12', 'Nichelino', 'Por', 'XL', 38, 1),
(14, 'MGNMRC01D16F335P', 'Marco', 'Mancini', '4B', '2003-04-12', 'Moncalieri', '', '', 12, 1),
(15, 'MGNMRC01D16F335P', 'Mario', 'Giacomelli', '3B', '2004-04-12', 'Nichelino', '', '', 0, 1),
(16, 'MGNMRC01D16F335P', 'Giampiero', 'Nuovi', '3d', '2002-05-12', 'Moncalieri', '', '', 0, 1),
(17, 'MGNMRC01D16F335P', 'Mario', 'Bros', '3C', '2005-12-12', 'Nichelino', '', '', 0, 1),
(18, 'MGNMRC01D16F335P', 'Marco', 'Magnanini', '4m', '2003-04-12', 'Moncalieri', '', '', 0, 1),
(19, 'MGNMRC01D16F335P', 'Gabriele', 'Franzon', '4B', '2005-05-12', 'Nichelino', '', '', 0, 1),
(20, 'MGNMRC01D16F335P', 'Gabriele', 'Gallo', '3d', '2003-05-12', 'Moncalieri', '', '', 0, 1),
(21, 'MGNMRC01D16F335P', 'Marco', 'Mancini', '5F', '2005-05-12', 'Moncalieri', '', '', 0, 1),
(22, 'MGNMRC01D16F335P', 'Gabriele', 'Mancini', '3d', '2003-05-12', 'Moncalieri', '', '', 0, 1),
(23, 'MGNMRC01D16F335P', 'Gabriele', 'Gallo', '3b', '2006-05-12', 'Dscds', '', '', 0, 1),
(24, 'MGNMRC01D16F335P', 'Marco', 'Mancini', '5F', '2003-05-12', 'Moncalieri', '', '', 0, 1),
(25, 'MGNMRC01D16F335P', 'Marco', 'Gallo', '3b', '2003-05-12', 'Nichelino', '', '', 0, 1),
(26, 'MGNMRC01D16F335P', 'Marco', 'Magnanini', '5F', '2002-02-02', 'Moncalieri', '', '', 0, 1),
(27, 'MGNMRC01D16F335P', 'Marco', 'Rossi', '5F', '2005-04-12', 'Torino', '', '', 0, 1),
(28, 'MGNMRC01D16F335P', 'Marco', 'Magnanini', '5F', '2003-05-12', 'Torino', '', '', 0, 1),
(29, 'MGNMRC01D16F335P', 'Marco', 'Magnanini', '3d', '2003-04-12', 'Moncalieri', '', '', 0, 1),
(30, 'MGNMRC01D16F335P', 'Marco', 'Magnanini', '5F', '2003-05-12', 'Moncalieri', 'Cen', 'S', 8, 1),
(31, 'MGNMRC01D16F335P', 'Marco', 'Magnanini', '5F', '2001-04-12', 'Nichelino', '', '', 0, 1),
(32, 'MGNMRC01D16F335P', 'Marco', 'Rttr', '5F', '2005-10-10', 'Roma', '', '', NULL, 1),
(33, 'MGNMRC01D16F335P', 'Marco', 'Magnanini', '5F', '2003-05-12', 'Moncalieri', '', '', NULL, 1),
(34, 'MGNMRC01D16F335P', 'Marco', 'Magnanini', '5F', '2003-05-12', 'Roma', '', '', NULL, 1),
(35, 'MGNMRC01D16F335P', 'Marco', 'Magnanini', '5F', '2003-05-12', 'Roma', '', '', NULL, 1),
(36, 'MGNMRC01D16F335P', 'Marco', 'Magnanini', '1A', '2009-04-12', 'Moncalieri', 'Att', 'M', 21, 1),
(37, 'MGNMRC01D16F335P', 'Marco', 'Magnanini', '5F', '2003-05-12', 'Roma', '', '', NULL, 1),
(38, 'MGNMRC01D16F335P', 'Luciano', 'Ciao', '1A', '2008-05-12', 'Torino', 'Cen', 'S', 17, 1),
(39, 'MGNMRC01D16F335P', 'Mario', 'Bros', '5D', '2003-01-01', 'Nichelino', 'Cen', 'XS', 4, 1),
(40, 'MGNMRC01D16F335P', 'Luigi', 'Llluigi', '3d', '2005-04-12', 'Moncalieri', 'Dif', 'M', 11, 1),
(41, 'MGNMRC01D16F335P', 'Marco', 'Magnanini', '5F', '2003-04-12', 'Roma', 'Att', 'S', 15, 1),
(42, 'MGNMRC01D16F335P', 'Paolo', 'Verdi', '5F', '2002-02-02', 'Moncalieri', '', '', NULL, 1),
(43, 'MGNMRC01D16F335P', 'Paolo', 'Verdi', '5F', '2002-02-02', 'Moncalieri', '', '', NULL, 1),
(44, 'MGNMRC01D16F335P', 'Paolo', 'Verdi', '5F', '2002-02-02', 'Moncalieri', 'Cen', 'M', 55, 1),
(45, 'MGNMRC01D16F335P', 'Paolo', 'Gialli', '5F', '2003-05-05', 'Nichelino', 'Att', 'S', 16, 1),
(46, 'MGNMRC01D16F335P', 'Caio', 'Bruto', '3D', '2005-03-24', 'Roma', 'Dif', 'M', 29, 1),
(47, 'MGNMRC01D16F335P', 'Marco', 'Gallo', '5F', '2002-02-12', 'Moncalieri', '', '', NULL, 1),
(48, 'MGNMRC01D16F335P', 'Bruto', 'Cassio', '3D', '2004-01-25', 'Roma', 'Dif', 'L', 20, 1),
(49, 'MGNMRC01D16F335P', 'Giulio', 'Cesare', '4B', '2004-01-01', 'Roma', 'Cen', 'S', 25, 1),
(50, 'MGNMRC01D16F335P', 'Giorgio', 'Chiellini', '4F', '2004-05-12', 'Torino', 'Por', 'L', 98, 1),
(51, 'MGNMRC01D16F335P', 'Alessandro', 'Del Piero', '3B', '2005-01-03', 'Moncalieri', 'Por', 'M', 1, 1),
(52, 'MGNMRC01D16F335P', 'Luca', 'Verdi', '2M', '2005-08-25', 'Moncalieri', 'Dif', 'M', 7, 1);

-- --------------------------------------------------------

--
-- Struttura della tabella `g_tesserati`
--

CREATE TABLE `g_tesserati` (
  `id_stagione` int(11) NOT NULL COMMENT 'collegamento a stagioni',
  `id_giocatore` int(11) NOT NULL COMMENT 'collegamento a giocatori'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `g_tesserati`
--

INSERT INTO `g_tesserati` (`id_stagione`, `id_giocatore`) VALUES
(1, 3),
(1, 4),
(1, 5),
(1, 10),
(1, 12),
(1, 13),
(1, 30),
(1, 36),
(1, 38),
(1, 39),
(1, 40),
(1, 41),
(1, 44),
(1, 45),
(1, 46),
(1, 48),
(1, 49),
(1, 50),
(1, 51),
(1, 52);

-- --------------------------------------------------------

--
-- Struttura della tabella `leghe`
--

CREATE TABLE `leghe` (
  `id` int(11) NOT NULL,
  `nome` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `leghe`
--

INSERT INTO `leghe` (`id`, `nome`) VALUES
(1, 'Mole Cup'),
(2, 'Duomo Cup');

-- --------------------------------------------------------

--
-- Struttura della tabella `sessioni`
--

CREATE TABLE `sessioni` (
  `token` varchar(256) NOT NULL,
  `id_amministratore` int(11) NOT NULL,
  `ultimo_accesso` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `sessioni`
--

INSERT INTO `sessioni` (`token`, `id_amministratore`, `ultimo_accesso`) VALUES
('$2y$10$/zIhotS5jykwSBzKQn/5q.BIdEHFuLWr1ruO6nH5wtw0MmR99/Ab2', 1, '2021-12-29 18:54:02'),
('$2y$10$1kNGOQ2xlg.jZdB6Uefale9e4wp9UKD.qwxEwra0HI9eUiF2NeYve', 1, '2021-12-29 20:49:41'),
('$2y$10$cEA0XrCRa/ZHqXnEN5dFMuKTMgPHUhWygbxh.xlZGaMgrsPlxWWP2', 1, '2021-12-28 17:26:55'),
('$2y$10$nprR1cDFmqIy299k7Jan5OuyBbO5KCMO/iv0P4hPMRbi2jjkNVvOy', 1, '2021-12-28 15:03:21'),
('$2y$10$qXHLqMzM4337aiT9XciQSemVe7xDfOz8bwPcVTEya1b.VeMt0inoi', 1, '2021-12-28 15:32:17'),
('$2y$10$Ve4KVDynB/B8CDN/J/EBZe3SZ/hcpltpzZ0MJKqWwUfrsBIMdMQ2.', 1, '2021-12-09 14:48:11');

-- --------------------------------------------------------

--
-- Struttura della tabella `squadre`
--

CREATE TABLE `squadre` (
  `id` int(11) NOT NULL,
  `nome` varchar(32) NOT NULL,
  `id_lega` int(11) NOT NULL COMMENT 'collegamento con leghe'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `squadre`
--

INSERT INTO `squadre` (`id`, `nome`, `id_lega`) VALUES
(1, 'Alfieri', 1),
(2, 'Majorana', 1),
(3, 'Galfer', 1),
(4, 'Convitto', 1),
(5, 'Sant\'Anna', 1),
(6, 'D\'azeglio', 1),
(7, 'Cattaneo', 1),
(8, 'Gioberti', 1),
(9, 'Valsalice', 1),
(10, 'Volta', 1),
(11, 'Gobetti', 1),
(12, 'Spinelli', 1);

-- --------------------------------------------------------

--
-- Struttura della tabella `stagioni`
--

CREATE TABLE `stagioni` (
  `id` int(11) NOT NULL,
  `nome` varchar(16) NOT NULL,
  `scadenza` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `stagioni`
--

INSERT INTO `stagioni` (`id`, `nome`, `scadenza`) VALUES
(0, 'cestino', '2020-01-01'),
(1, '2020-2021(prova)', '2022-06-10'),
(3, '2022', '2022-08-31');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `amministratori`
--
ALTER TABLE `amministratori`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `certificati_med`
--
ALTER TABLE `certificati_med`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `codici_ripristino`
--
ALTER TABLE `codici_ripristino`
  ADD UNIQUE KEY `token` (`token`);

--
-- Indici per le tabelle `dirigenti`
--
ALTER TABLE `dirigenti`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `giocatori`
--
ALTER TABLE `giocatori`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `leghe`
--
ALTER TABLE `leghe`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `sessioni`
--
ALTER TABLE `sessioni`
  ADD PRIMARY KEY (`token`);

--
-- Indici per le tabelle `squadre`
--
ALTER TABLE `squadre`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `stagioni`
--
ALTER TABLE `stagioni`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `amministratori`
--
ALTER TABLE `amministratori`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT per la tabella `certificati_med`
--
ALTER TABLE `certificati_med`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT per la tabella `dirigenti`
--
ALTER TABLE `dirigenti`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT per la tabella `giocatori`
--
ALTER TABLE `giocatori`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT per la tabella `leghe`
--
ALTER TABLE `leghe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT per la tabella `squadre`
--
ALTER TABLE `squadre`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT per la tabella `stagioni`
--
ALTER TABLE `stagioni`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
