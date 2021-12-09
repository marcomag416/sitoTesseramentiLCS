Select dir.id, dir.cf, dir.nome, dir.cognome FROM sessioni sess
inner join amministratori amm on amm.id = sess.id_amministratore and sess.token = :token
inner join squadre sq on amm.id_squadra = sq.id,
d_tesserati dtess
inner join dirigenti dir on dtess.id_giocatore = dir.id,
stagioni stag
WHERE stag.id = dtess.id_stagione and stag.id = amm.id_stagione and stag.scadenza > CURRENT_DATE and dir.id_squadra = sq.id
order by dir.id