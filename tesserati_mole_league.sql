-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Ott 06, 2021 alle 19:20
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
(1, 'prova@mail.com', '$2y$10$DAHZoCCWo0AYGUaPgsfCGOpHgsGlBnVeCqZlpBOpdk.8xqayWJTPq', 1, 1);

-- --------------------------------------------------------

--
-- Struttura della tabella `certificati_med`
--

CREATE TABLE `certificati_med` (
  `id` int(11) NOT NULL,
  `scadenza` date NOT NULL,
  `img` varchar(256) DEFAULT NULL,
  `fisico` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'cert fisico 1 cert online 0',
  `id_giocatore` int(11) NOT NULL COMMENT 'collegamento a giocatori'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `dirigenti`
--

CREATE TABLE `dirigenti` (
  `id` int(11) NOT NULL,
  `cf` varchar(15) NOT NULL,
  `nome` text NOT NULL,
  `cognome` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `d_tesserati`
--

CREATE TABLE `d_tesserati` (
  `id_stagione` int(11) NOT NULL COMMENT 'collegamento a stagioni',
  `id_giocatore` int(11) NOT NULL COMMENT 'collegamento a giocatori'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `giocatori`
--

CREATE TABLE `giocatori` (
  `id` int(11) NOT NULL,
  `cf` varchar(15) NOT NULL,
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

-- --------------------------------------------------------

--
-- Struttura della tabella `g_tesserati`
--

CREATE TABLE `g_tesserati` (
  `id_stagione` int(11) NOT NULL COMMENT 'collegamento a stagioni',
  `id_giocatore` int(11) NOT NULL COMMENT 'collegamento a giocatori'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
(1, 'mole cup');

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
('$2y$10$.KqENU/m.uSDeNQiZD1cFufg/HXdmepfI701FJj.LkJI6o0ViVf6y', 1, '2021-10-04 09:01:40'),
('$2y$10$0MbKr56Y.Pp6iuj6zzUEbea33rIFQtalU9tjtFWF7.jsOBen0KzLW', 1, '2021-10-04 10:06:20'),
('$2y$10$0NP9J8LMf3A4lxOY89ZVReXmfT2Oz9RU7YNBKnzGpRvWjtHo8d5CO', 1, '2021-10-04 10:21:21'),
('$2y$10$7UXtp6VkFbhCjLlLdudZaegq3ZHMgH3q59Sbu8l416JJXsuuFI12e', 1, '2021-10-04 10:00:48'),
('$2y$10$a/Ia0gy3JZCKHY8GH4n5uuQt1Zrbdb4ERK9u89ra1gICPu.4QBCGW', 1, '2021-10-04 10:01:43'),
('$2y$10$BWhHBzssnkeh76MqZklZVufvhPFUz8Euo7dDBTLBnGADc6CZIPRgq', 1, '2021-10-04 10:06:07'),
('$2y$10$cFUlmsjHgeDZCaQ1kPYsE.cZO9OIcURe6.mzYhpdYIfB8CZTtP9Fq', 1, '2021-10-04 10:04:15'),
('$2y$10$D8DCT5GN2VzFFSgMqDS/uO4Y8HP6VL5ghuvMgSUw8NR4QS8afIqP.', 1, '2021-10-04 10:02:27'),
('$2y$10$EZNV4jkyDkMbnJC8jC9YPu99LgSECdo0/O1cjdYT5cd.dd7/qUbyG', 1, '2021-10-04 10:14:13'),
('$2y$10$Fp1nZeAO12rEkMmuPJMF2uCwHp7WuuMDsMRnqC6W.hA9F0FyG7aWO', 1, '2021-10-04 10:02:33'),
('$2y$10$hS8CYE6SaBz/jKz6V5ZRT.MwiXPenBZ9MFBmpc3HrxsBYsAxrMx.O', 1, '2021-10-04 10:01:29'),
('$2y$10$iM9A1v/btD8mFsWADQU2CuCKjq3YA5d2tzYBRuHmH/l5EEYeDiws6', 1, '2021-10-04 10:00:52'),
('$2y$10$jBoikFqx8RobtHEObE3b1uckJriUXLoYmKs7AoX.nbKphEAmuB0xm', 1, '2021-10-04 10:06:04'),
('$2y$10$L2R0qZf0/TlXExrP7zu4..52TkTzoLXs5K4Snrp7NsytWBhyXhf7O', 1, '2021-10-03 22:36:28'),
('$2y$10$MLTUqBYqBI3qO4e3AXYP0uy7qZIyVujzLH3yHRjMznF5Ru.56iam.', 1, '2021-10-04 10:16:59'),
('$2y$10$mrMvD8H8V2XSySSS5J5CsOV98n6S111KrJwZOJGQLhPse89slOq0q', 1, '2021-10-04 10:01:08'),
('$2y$10$Nf5j51vPWmLN3xcJu4UK0ugJJEE.6HAbokYEs48lAcprk8uITA03i', 1, '2021-10-04 10:13:35'),
('$2y$10$VGSpxNv2rwNFhrplYwQpyuTuQr6zJSxIqD7VW7Ec3BQD/sbUCebXC', 1, '2021-10-04 10:02:19'),
('$2y$10$WzOucWiAYrjq2jXKrFGTBuGgHBxbUy/tc3X/omTlvbDpIA0LKvUsi', 1, '2021-10-04 10:21:36'),
('$2y$10$xDBVCBPNXD29NI0cLisQj.tE.PGaWV7R7v4EWgqGbXYAwV3Jo5HVS', 1, '2021-10-04 10:05:05');

-- --------------------------------------------------------

--
-- Struttura della tabella `squadre`
--

CREATE TABLE `squadre` (
  `id` int(11) NOT NULL,
  `nome` varchar(32) NOT NULL,
  `id_lega` int(11) NOT NULL COMMENT 'collegamento con leghe'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
(1, '2020-2021', '2021-06-10');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT per la tabella `certificati_med`
--
ALTER TABLE `certificati_med`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `dirigenti`
--
ALTER TABLE `dirigenti`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `giocatori`
--
ALTER TABLE `giocatori`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `leghe`
--
ALTER TABLE `leghe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT per la tabella `squadre`
--
ALTER TABLE `squadre`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `stagioni`
--
ALTER TABLE `stagioni`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
